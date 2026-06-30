import { expect, test } from "@playwright/test";

test.describe("Authentication Portuguese UI", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();
    await page.addInitScript(() => {
      window.localStorage.setItem("boom.user.locale", "pt-BR");
    });
  });

  test("shows localized signup and verification labels", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByRole("heading", { name: "Criar conta de responsável" })).toBeVisible();
    await expect(page.getByLabel("Nome de exibição")).toBeVisible();
    await expect(page.getByLabel("Usuário")).toBeVisible();
    await expect(page.getByLabel("Telefone")).toBeVisible();
    await expect(page.getByLabel("Número do documento")).toBeVisible();
  });
});
