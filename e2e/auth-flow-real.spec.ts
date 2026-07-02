import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const password = "BoomTest123!";
const backendBaseUrl = "http://localhost:8080";

function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-9);
}

async function setLocale(page: Page, locale: "pt-BR" | "en-US") {
  await page.addInitScript((value) => {
    window.localStorage.setItem("boom.user.locale", value);
  }, locale);
}

async function getBoomSessionCookie(page: Page): Promise<string> {
  await expect
      .poll(async () => {
        const cookies = await page.context().cookies();
        return cookies.find((cookie) => cookie.name === "BOOM_SESSION")?.value ?? null;
      }, {
        message: "BOOM_SESSION cookie should be available after login",
        timeout: 10_000,
      })
      .not.toBeNull();

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((cookie) => cookie.name === "BOOM_SESSION");

  if (!sessionCookie?.value) {
    throw new Error("BOOM_SESSION cookie was not found after login.");
  }

  return sessionCookie.value;
}

async function seedHelenaForCurrentSession(page: Page, request: APIRequestContext) {
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

async function fillSignupForm(page: Page) {
  const suffix = uniqueSuffix();

  const data = {
    displayName: `Daniel Test ${suffix}`,
    username: `daniel.e2e.${suffix}`,
    email: `daniel.e2e.${suffix}@boom.local`,
    phoneNumber: `+551199${suffix.slice(-7)}`,
    country: "BR",
    documentType: "CPF",
    documentNumber: `91${suffix}`.slice(0, 11),
    password,
  };

  await page.getByLabel(/Display name|Nome de exibição/).fill(data.displayName);
  await page.getByLabel(/Username|Usuário/).fill(data.username);
  await page.getByLabel(/Email|E-mail/).fill(data.email);
  await page.getByLabel(/Phone|Telefone/).fill(data.phoneNumber);
  await page.getByLabel(/Country|País/).fill(data.country);
  await page.getByLabel(/Document type|Tipo de documento/).fill(data.documentType);
  await page.getByLabel(/Document number|Número do documento/).fill(data.documentNumber);
  await page.getByLabel(/Password|Senha/).fill(data.password);

  return data;
}

async function fillSignupFormWithData(
    page: Page,
    data: {
      displayName: string;
      username: string;
      email: string;
      phoneNumber: string;
      country: string;
      documentType: string;
      documentNumber: string;
      password: string;
    },
) {
  await page.getByLabel("Display name").fill(data.displayName);
  await page.getByLabel("Username").fill(data.username);
  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Phone").fill(data.phoneNumber);
  await page.getByLabel("Country").fill(data.country);
  await page.getByLabel("Document type").fill(data.documentType);
  await page.getByLabel("Document number").fill(data.documentNumber);
  await page.getByLabel("Password").fill(data.password);
}

test.describe("Authentication UI", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("anonymous user sees login screen in English", async ({ page }) => {
    await setLocale(page, "en-US");
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Username or email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("anonymous user sees login screen in Portuguese", async ({ page }) => {
    await setLocale(page, "pt-BR");
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
    await expect(page.getByLabel("Usuário ou e-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
  });

  test("can navigate from login to signup", async ({ page }) => {
    await setLocale(page, "en-US");
    await page.goto("/");

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByRole("heading", { name: "Create guardian account" })).toBeVisible();
    await expect(page.getByLabel("Display name")).toBeVisible();
  });

  test("shows a useful duplicate-account error", async ({ page, context }) => {
    await setLocale(page, "en-US");

    const suffix = uniqueSuffix();
    const signup = {
      displayName: `Daniel Duplicate ${suffix}`,
      username: `daniel.duplicate.${suffix}`,
      email: `daniel.duplicate.${suffix}@boom.local`,
      phoneNumber: `+551198${suffix.slice(-7)}`,
      country: "BR",
      documentType: "CPF",
      documentNumber: `81${suffix}`.slice(0, 11),
      password,
    };

    await page.goto("/");
    await page.getByRole("button", { name: "Create account" }).click();

    await fillSignupFormWithData(page, signup);

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByRole("heading", { name: "Verify phone" })).toBeVisible();

    await context.clearCookies();

    await page.goto("/");
    await page.getByRole("button", { name: "Create account" }).click();

    await fillSignupFormWithData(page, signup);

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.locator(".auth-error")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create guardian account" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Verify phone" })).not.toBeVisible();
  });

  test("can complete signup and reach phone verification", async ({ page }) => {
    await setLocale(page, "en-US");
    await page.goto("/");

    await page.getByRole("button", { name: "Create account" }).click();

    await fillSignupForm(page);

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByRole("heading", { name: "Verify phone" })).toBeVisible();
    await expect(page.getByLabel("Verification code")).toBeVisible();
  });

  test("can complete signup, verify phone, login, see dashboard, and logout", async ({ page, request }) => {
    await setLocale(page, "en-US");
    await page.goto("/");

    await page.getByRole("button", { name: "Create account" }).click();

    const signup = await fillSignupForm(page);

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByRole("heading", { name: "Verify phone" })).toBeVisible();

    const devCodeLocator = page.locator(".auth-dev-code strong");

    if (await devCodeLocator.isVisible()) {
      const devCode = (await devCodeLocator.textContent())?.trim();

      if (devCode) {
        await page.getByLabel("Verification code").fill(devCode);
      }
    }

    await page.getByRole("button", { name: "Verify phone" }).click();

    await expect(page.getByText("Phone verified. You can now sign in.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

    await page.getByLabel("Username or email").fill(signup.username);
    await page.getByLabel("Password").fill(signup.password);
    const loginResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/v1/auth/login") &&
        response.request().method() === "POST",
    );

    await page.getByRole("button", { name: "Sign in" }).click();

    const loginResponse = await loginResponsePromise;

    expect(loginResponse.ok()).toBeTruthy();

    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await seedHelenaForCurrentSession(page, request);

    await page.reload();

    await expect(page.getByText("Parent dashboard")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Helena.*progress|Helena progress/ })).toBeVisible();
    await expect(page.getByText("Completed activities")).toBeVisible();
    await expect(page.getByText("Study time")).toBeVisible();
    await expect(page.getByText("Accuracy", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Subject performance" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });
});