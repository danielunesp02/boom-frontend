import { expect, test } from '@playwright/test';
import dashboard from './fixtures/dashboard.json' assert { type: 'json' };

test('user can change locale and the selection is persisted locally', async ({ page }) => {
  await page.route('**/api/v1/parents/dashboard', async (route) => {
    await route.fulfill({ json: dashboard });
  });

  await page.route('**/api/v1/users/me/preferences', async (route) => {
    await route.fulfill({ status: 200, json: { locale: 'pt-BR' } });
  });

  await page.goto('/');

  await expect(page.getByText('Parent dashboard')).toBeVisible();

  await page.getByTestId('locale-switcher').selectOption('pt-BR');

  await expect(page.getByText('Dashboard dos pais')).toBeVisible();
  await expect(page.getByText('Atividades concluídas')).toBeVisible();

  await page.reload();

  await expect(page.getByText('Dashboard dos pais')).toBeVisible();
  await expect(page.getByTestId('locale-switcher')).toHaveValue('pt-BR');
});
