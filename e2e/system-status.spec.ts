import { expect, test } from "@playwright/test";

test("system status page shows backend API status", async ({ page }) => {
  await page.goto("/system/status");

  await expect(page.getByRole("heading", { name: "Boom system status" })).toBeVisible();
  await expect(page.getByText("API: OK")).toBeVisible();
});
