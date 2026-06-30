import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const backendBaseUrl = "http://localhost:8080";

async function setLocale(page: Page, locale: "pt-BR" | "en-US") {
  await page.addInitScript((value) => {
    window.localStorage.setItem("boom.user.locale", value);
  }, locale);
}

async function loginAsDaniel(page: Page) {
  await page.goto("/");

  await page.getByLabel(/Username or email|Usuário ou e-mail/).fill("daniel.test");
  await page.getByLabel(/Password|Senha/).fill("BoomTest123!");

  const loginResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/api/v1/auth/login") &&
      response.request().method() === "POST",
  );

  await page.getByRole("button", { name: /Sign in|Entrar/ }).click();

  const loginResponse = await loginResponsePromise;

  expect(
      loginResponse.ok(),
      `Login failed with ${loginResponse.status()}: ${await loginResponse.text()}`,
  ).toBeTruthy();

  await expect(page.getByRole("button", { name: /Logout|Sair/ })).toBeVisible();
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

async function seedHelena(page: Page, request: APIRequestContext) {
  const boomSession = await getBoomSessionCookie(page);

  const response = await request.post(`${backendBaseUrl}/api/v1/dev/seed/helena`, {
    headers: {
      Cookie: `BOOM_SESSION=${boomSession}`,
    },
  });

  const body = await response.text();

  expect(
      response.ok(),
      `Seed failed with ${response.status()}: ${body}`,
  ).toBeTruthy();
}

async function fetchJsonFromBackend<T>(
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
      `Request ${path} failed with ${response.status()}: ${body}`,
  ).toBeTruthy();

  return JSON.parse(body) as T;
}

type ParentStudent = {
  studentId: string;
  displayName: string;
  gradeLevel: string;
  targetSchoolSystem: string;
  preferredLocale: string;
  relationshipType: string;
  primary: boolean;
};

type DashboardResponse = {
  student: {
    id: string;
    displayName: string;
    gradeLevel: string;
    targetSchoolSystem: string;
  };
};

test.describe("Authenticated student dashboard scope", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("dashboard uses the authenticated guardian primary student", async ({ page, request }) => {
    await setLocale(page, "en-US");

    await loginAsDaniel(page);
    await seedHelena(page, request);

    const students = await fetchJsonFromBackend<ParentStudent[]>(
        page,
        request,
        "/api/v1/parents/students",
    );

    expect(students.length).toBeGreaterThan(0);

    const primaryStudent = students.find((student) => student.primary) ?? students[0];

    const dashboard = await fetchJsonFromBackend<DashboardResponse>(
        page,
        request,
        "/api/v1/parents/dashboard?periodPreset=LAST_30_DAYS",
    );

    expect(dashboard.student.id).toBe(primaryStudent.studentId);
    expect(dashboard.student.displayName).toBe(primaryStudent.displayName);
    expect(dashboard.student.gradeLevel).toBe(primaryStudent.gradeLevel);
    expect(dashboard.student.targetSchoolSystem).toBe(primaryStudent.targetSchoolSystem);

    await page.goto("/");

    await expect(page.getByText("Parent dashboard")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Helena.*progress|Helena progress/ })).toBeVisible();
  });

  test("dashboard API is blocked without a session", async ({ request }) => {
    const response = await request.get(
        `${backendBaseUrl}/api/v1/parents/dashboard?periodPreset=LAST_30_DAYS`,
    );

    expect([401, 403]).toContain(response.status());
  });
});