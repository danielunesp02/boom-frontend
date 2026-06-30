import { expect, test } from '@playwright/test';
import dashboard from './fixtures/dashboard.json' assert { type: 'json' };
import dashboardPt from './fixtures/dashboard-pt.json' assert { type: 'json' };

test('user can change locale and dashboard reloads localized domain content', async ({ page }) => {
  let lastDashboardLocale = 'en-US';

  await page.route('**/api/v1/users/me/preferences', async (route) => {
    await route.fulfill({ status: 200, json: { locale: 'pt-BR' } });
  });

  await page.route('**/api/v1/parents/dashboard', async (route) => {
    lastDashboardLocale = route.request().headers()['accept-language'] ?? 'missing';

    await route.fulfill({
      json: lastDashboardLocale === 'pt-BR' ? dashboardPt : dashboard
    });
  });

  await page.goto('/');

  await expect(page.getByText('Parent dashboard')).toBeVisible();
  await expect(page.getByText('Mathematics')).toBeVisible();

  await page.getByTestId('locale-switcher').selectOption('pt-BR');

  await expect(page.getByText('Dashboard dos pais')).toBeVisible();
  await expect(page.getByText('Atividades concluídas')).toBeVisible();

  // Domain content should also come localized from the API response.
  await expect(page.getByText('Matemática')).toBeVisible();
  await expect(page.getByText('Frações equivalentes')).toBeVisible();
  await expect(page.getByText('Revisar frações equivalentes')).toBeVisible();

  expect(lastDashboardLocale).toBe('pt-BR');

  await page.reload();

  await expect(page.getByTestId('locale-switcher')).toHaveValue('pt-BR');
  await expect(page.getByText('Dashboard dos pais')).toBeVisible();
});
