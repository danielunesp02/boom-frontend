import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const backendBaseUrl = "http://localhost:8080";
const password = "BoomTest123!";

type ParentStudent = {
    studentId: string;
    displayName: string;
    primary: boolean;
};

type LearningActivitySummary = {
    activityId: string;
    code: string;
    title: string;
};

type LearningActivitiesSeedResponse = {
    activities: number;
    questions: number;
    options: number;
    references: {
        fractionsActivity?: string;
        [key: string]: string | undefined;
    };
};

type MetricSummary = {
    id: string;
    label: string;
    value: string;
};

type SubjectPerformance = {
    subjectId: string;
    subjectName: string;
    accuracy: number;
    studyTimeMinutes: number;
    trend: string;
    activeGapCount: number;
};

type ParentDashboardResponse = {
    metrics: MetricSummary[];
    subjectPerformance: SubjectPerformance[];
    weeklySummary: {
        completedActivities: number;
        totalStudyTimeMinutes: number;
        averageAccuracy: number;
        currentStreakDays: number;
    };
};

type AssessmentAttemptResponse = {
    attemptId: string;
    studentId: string;
    activityId: string;
    status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    score: number;
    accuracy: number;
};

async function setLocale(page: Page, locale: "pt-BR" | "en-US") {
    await page.addInitScript((value) => {
        window.localStorage.setItem("boom.user.locale", value);
    }, locale);
}

async function loginAsDaniel(page: Page) {
    await page.goto("/");

    await page.getByLabel(/Username or email|Usuário ou e-mail/).fill("daniel.test");
    await page.getByLabel(/Password|Senha/).fill(password);

    const loginResponsePromise = page.waitForResponse(
        (response) =>
            response.url().includes("/api/v1/auth/login") &&
            response.request().method() === "POST",
        { timeout: 10_000 },
    );

    await page.getByRole("button", { name: /Sign in|Entrar/ }).click();

    const loginResponse = await loginResponsePromise;

    expect(
        loginResponse.ok(),
        `Login failed with ${loginResponse.status()}: ${await loginResponse.text()}`,
    ).toBeTruthy();

    await expect(page.getByRole("button", { name: /Logout|Sair/ })).toBeVisible({
        timeout: 10_000,
    });
}

async function getBoomSessionCookie(page: Page): Promise<string> {
    await expect
        .poll(
            async () => {
                const cookies = await page.context().cookies();
                return cookies.find((cookie) => cookie.name === "BOOM_SESSION")?.value ?? null;
            },
            {
                message: "BOOM_SESSION cookie should be available after login",
                timeout: 10_000,
            },
        )
        .not.toBeNull();

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((cookie) => cookie.name === "BOOM_SESSION");

    if (!sessionCookie?.value) {
        throw new Error("BOOM_SESSION cookie was not found after login.");
    }

    return sessionCookie.value;
}

async function backendGet<T>(
    page: Page,
    request: APIRequestContext,
    path: string,
): Promise<T> {
    const boomSession = await getBoomSessionCookie(page);

    const response = await request.get(`${backendBaseUrl}${path}`, {
        headers: {
            Cookie: `BOOM_SESSION=${boomSession}`,
        },
    });

    const body = await response.text();

    expect(
        response.ok(),
        `GET ${path} failed with ${response.status()}: ${body}`,
    ).toBeTruthy();

    return JSON.parse(body) as T;
}

async function backendPost<T>(
    page: Page,
    request: APIRequestContext,
    path: string,
    data?: unknown,
): Promise<T> {
    const boomSession = await getBoomSessionCookie(page);

    const response = await request.post(`${backendBaseUrl}${path}`, {
        headers: {
            Cookie: `BOOM_SESSION=${boomSession}`,
        },
        data,
    });

    const body = await response.text();

    expect(
        response.ok(),
        `POST ${path} failed with ${response.status()}: ${body}`,
    ).toBeTruthy();

    return body ? (JSON.parse(body) as T) : ({} as T);
}

async function seedLearningWorld(page: Page, request: APIRequestContext) {
    await backendPost(page, request, "/api/v1/dev/seed/helena");
    await backendPost(page, request, "/api/v1/dev/seed/learning-taxonomy");

    return backendPost<LearningActivitiesSeedResponse>(
        page,
        request,
        "/api/v1/dev/seed/learning-activities",
    );
}

async function getPrimaryStudent(
    page: Page,
    request: APIRequestContext,
): Promise<ParentStudent> {
    const students = await backendGet<ParentStudent[]>(page, request, "/api/v1/parents/students");

    expect(students.length).toBeGreaterThan(0);

    return students.find((student) => student.primary) ?? students[0];
}

async function resolveFractionsActivityId(
    page: Page,
    request: APIRequestContext,
    seedResult: LearningActivitiesSeedResponse,
): Promise<string> {
    if (seedResult.references.fractionsActivity) {
        return seedResult.references.fractionsActivity;
    }

    const activities = await backendGet<LearningActivitySummary[]>(
        page,
        request,
        "/api/v1/learning/activities",
    );

    const fractionsActivity = activities.find(
        (activity) => activity.code === "MATH_FRACTIONS_VISUAL_EQUIVALENCE_PRACTICE",
    );

    expect(fractionsActivity, "Fractions activity should be available after seed").toBeTruthy();

    return fractionsActivity!.activityId;
}

async function getDashboard(
    page: Page,
    request: APIRequestContext,
): Promise<ParentDashboardResponse> {
    return backendGet<ParentDashboardResponse>(page, request, "/api/v1/parents/dashboard");
}

function metricValueAsNumber(dashboard: ParentDashboardResponse, metricId: string): number {
    const metric = dashboard.metrics.find((item) => item.id === metricId);

    expect(metric, `Metric ${metricId} should exist`).toBeTruthy();

    const numeric = Number(metric!.value.replace(/[^0-9.]/g, ""));

    expect(
        Number.isNaN(numeric),
        `Metric ${metricId} should be numeric. Value: ${metric!.value}`,
    ).toBeFalsy();

    return numeric;
}

async function completeFractionsActivityInUi(
    page: Page,
    request: APIRequestContext,
    studentId: string,
    activityId: string,
): Promise<AssessmentAttemptResponse> {
    const startAttemptResponsePromise = page.waitForResponse(
        (response) =>
            response.url().includes(`/api/v1/students/${studentId}/activities/${activityId}/attempts`) &&
            response.request().method() === "POST",
        { timeout: 15_000 },
    );

    await page.goto(`/student/activity?studentId=${studentId}&activityId=${activityId}`);

    await expect(
        page.getByRole("heading", { name: /Visual fraction comparison practice/i }),
    ).toBeVisible({ timeout: 15_000 });

    const startAttemptResponse = await startAttemptResponsePromise;
    const startedAttempt = (await startAttemptResponse.json()) as AssessmentAttemptResponse;

    expect(startedAttempt.status).toBe("IN_PROGRESS");

    await page.getByRole("button", { name: /A\s+2\/4/i }).click();
    await page.getByRole("button", { name: /Check answer/i }).click();

    await expect(
        page.locator(".student-player-feedback-card").getByText("Nice work!"),
    ).toBeVisible();

    await page.getByRole("button", { name: /^Next$/i }).click();

    await page.getByRole("button", { name: /B\s+1\/2/i }).click();
    await page.getByRole("button", { name: /Check answer/i }).click();

    await expect(
        page.locator(".student-player-feedback-card").getByText("Nice work!"),
    ).toBeVisible();

    await page.getByRole("button", { name: /^Finish$/i }).click();

    await expect(page.getByText(/completed the activity/i)).toBeVisible({
        timeout: 15_000,
    });

    const completedAttempt = await backendGet<AssessmentAttemptResponse>(
        page,
        request,
        `/api/v1/attempts/${startedAttempt.attemptId}`,
    );

    expect(completedAttempt.status).toBe("COMPLETED");
    expect(completedAttempt.answeredQuestions).toBe(2);
    expect(completedAttempt.correctAnswers).toBe(2);
    expect(completedAttempt.accuracy).toBe(100);

    return completedAttempt;
}

test.describe("Student flow updates parent dashboard", () => {
    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test("completed student activity updates parent dashboard without manual rebuild", async ({
                                                                                                  page,
                                                                                                  request,
                                                                                              }) => {
        await setLocale(page, "en-US");
        await loginAsDaniel(page);

        const seedResult = await seedLearningWorld(page, request);
        const student = await getPrimaryStudent(page, request);
        const activityId = await resolveFractionsActivityId(page, request, seedResult);

        // Baseline normalization only.
        // The behavior under test is that we do NOT rebuild after completing the activity.
        await backendPost(page, request, "/api/v1/dev/snapshots/student-skills/daily/rebuild");

        const beforeDashboard = await getDashboard(page, request);
        const beforeCompletedActivities = metricValueAsNumber(
            beforeDashboard,
            "completedActivities",
        );

        await completeFractionsActivityInUi(page, request, student.studentId, activityId);

        await expect
            .poll(
                async () => {
                    const dashboard = await getDashboard(page, request);
                    return metricValueAsNumber(dashboard, "completedActivities");
                },
                {
                    message:
                        "Parent dashboard completed activities should increase after student completes an activity",
                    timeout: 15_000,
                    intervals: [500, 1_000, 2_000],
                },
            )
            .toBeGreaterThan(beforeCompletedActivities);

        const afterDashboard = await getDashboard(page, request);
        const afterCompletedActivities = metricValueAsNumber(
            afterDashboard,
            "completedActivities",
        );
        const afterAccuracy = metricValueAsNumber(afterDashboard, "accuracy");

        expect(afterCompletedActivities).toBeGreaterThan(beforeCompletedActivities);
        expect(afterAccuracy).toBeGreaterThanOrEqual(90);

        expect(
            afterDashboard.subjectPerformance.some(
                (subject) =>
                    /Mathematics|Matemática/i.test(subject.subjectName) && subject.accuracy >= 90,
            ),
            "Mathematics subject performance should reflect the completed 100% activity",
        ).toBeTruthy();

        await page.goto("/");

        await expect(page.getByText(String(afterCompletedActivities), { exact: true })).toBeVisible({
            timeout: 15_000,
        });

        await expect(page.getByText(/100%|9[0-9]%/)).toBeVisible();
    });
});