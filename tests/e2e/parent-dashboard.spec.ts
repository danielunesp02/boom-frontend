import { expect, test } from '@playwright/test';
import dashboard from './fixtures/dashboard.json' assert { type: 'json' };
import emptyDashboard from './fixtures/dashboard-empty.json' assert { type: 'json' };

test('parent dashboard renders learning history, performance, gaps and action plan', async ({ page }) => {
  await page.route('**/api/v1/parents/dashboard', async (route) => {
    await route.fulfill({ json: dashboard });
  });

  await page.goto('/');

  await expect(page.getByTestId('parent-dashboard')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Helena progress/i })).toBeVisible();

  await expect(page.getByTestId('metric-completed-activities')).toContainText('5');
  await expect(page.getByTestId('metric-study-time')).toContainText('130 min');
  await expect(page.getByTestId('metric-average-accuracy')).toContainText('76%');

  await expect(page.getByTestId('activity-history-chart')).toBeVisible();
  await expect(page.getByTestId('subject-performance-panel')).toContainText('Mathematics');
  await expect(page.getByTestId('learning-gap-list')).toContainText('Equivalent fractions');
  await expect(page.getByTestId('current-action-plan-card')).toContainText('Review equivalent fractions');
  await expect(page.getByTestId('recent-activity-timeline')).toContainText('Fractions practice');
});

test('parent dashboard shows a friendly empty state for a student with no activity', async ({ page }) => {
  await page.route('**/api/v1/parents/dashboard', async (route) => {
    await route.fulfill({ json: emptyDashboard });
  });

  await page.goto('/');

  await expect(page.getByTestId('dashboard-empty-state')).toBeVisible();
  await expect(page.getByTestId('dashboard-empty-state')).toContainText('No learning activity yet');
});

test('parent dashboard handles access denied responses clearly', async ({ page }) => {
  await page.route('**/api/v1/parents/dashboard', async (route) => {
    await route.fulfill({
      status: 403,
      json: { message: 'Forbidden' }
    });
  });

  await page.goto('/');

  await expect(page.getByTestId('dashboard-error')).toBeVisible();
  await expect(page.getByTestId('dashboard-error')).toContainText('You do not have access');
});

test('parent dashboard handles backend failures without breaking the UI', async ({ page }) => {
  await page.route('**/api/v1/parents/dashboard', async (route) => {
    await route.fulfill({
      status: 500,
      json: { message: 'Unexpected error' }
    });
  });

  await page.goto('/');

  await expect(page.getByTestId('dashboard-error')).toBeVisible();
  await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
});
