import { expect, test } from "@playwright/test";

const backendBaseUrl = "http://localhost:8080";

test.describe("Commit smoke", () => {
  test("backend core APIs respond for authenticated guardian", async ({ request }) => {
    const signup = await request.post(`${backendBaseUrl}/api/v1/auth/signup`, {
      data: {
        displayName: "Daniel Bevilacqua",
        username: "daniel.test",
        email: "daniel.test@boom.local",
        phoneNumber: "+5511999999999",
        country: "BR",
        documentType: "CPF",
        documentNumber: "12345678909",
        password: "BoomTest123!",
      },
    });

    expect([200, 201, 400, 409]).toContain(signup.status());

    const login = await request.post(`${backendBaseUrl}/api/v1/auth/login`, {
      data: {
        identifier: "daniel.test",
        password: "BoomTest123!",
      },
    });

    expect(login.ok(), `Login failed: ${login.status()} ${await login.text()}`).toBeTruthy();

    const seedHelena = await request.post(`${backendBaseUrl}/api/v1/dev/seed/helena`);
    expect(seedHelena.ok(), `Seed Helena failed: ${seedHelena.status()} ${await seedHelena.text()}`).toBeTruthy();

    const maybeSeedTaxonomy = await request.post(`${backendBaseUrl}/api/v1/dev/seed/learning-taxonomy`);
    expect([200, 404]).toContain(maybeSeedTaxonomy.status());

    const me = await request.get(`${backendBaseUrl}/api/v1/auth/me`);
    expect(me.ok(), `auth/me failed: ${me.status()} ${await me.text()}`).toBeTruthy();

    const students = await request.get(`${backendBaseUrl}/api/v1/parents/students`);
    expect(students.ok(), `students failed: ${students.status()} ${await students.text()}`).toBeTruthy();

    const studentsJson = await students.json();
    expect(Array.isArray(studentsJson)).toBeTruthy();
    expect(studentsJson.length).toBeGreaterThan(0);

    const dashboard = await request.get(`${backendBaseUrl}/api/v1/parents/dashboard?periodPreset=LAST_30_DAYS`);
    expect(dashboard.ok(), `dashboard failed: ${dashboard.status()} ${await dashboard.text()}`).toBeTruthy();

    const dashboardJson = await dashboard.json();
    expect(dashboardJson.student.displayName).toBeTruthy();
    expect(dashboardJson.student.id).toBeTruthy();

    const learningSubjects = await request.get(`${backendBaseUrl}/api/v1/learning/subjects`);
    expect([200, 404]).toContain(learningSubjects.status());

    if (learningSubjects.status() === 200) {
      const subjectsJson = await learningSubjects.json();
      expect(Array.isArray(subjectsJson)).toBeTruthy();
    }
  });

  test("frontend renders authenticated dashboard after login", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("boom.user.locale", "en-US");
    });

    await page.goto("/");

    await page.getByLabel("Username or email").fill("daniel.test");
    await page.getByLabel("Password").fill("BoomTest123!");

    const loginResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/api/v1/auth/login") &&
      response.request().method() === "POST",
    );

    await page.getByRole("button", { name: "Sign in" }).click();

    const loginResponse = await loginResponsePromise;
    expect(loginResponse.ok()).toBeTruthy();

    await expect(page.getByText("Parent dashboard")).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });
});
