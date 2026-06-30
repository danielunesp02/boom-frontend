import { parentDashboardMock } from '../data/parentDashboard.mock';
import type { ParentDashboardResponse } from '../types/parentDashboardTypes';
import { getMessage } from '../../../shared/i18n/messages';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isSupportedLocale } from '../../../shared/i18n/supportedLocales';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function fetchParentDashboard(): Promise<ParentDashboardResponse> {
  if (USE_MOCKS) {
    await wait(250);
    return parentDashboardMock;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/parents/dashboard`, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const locale = getCurrentLocale();

    if (response.status === 403) {
      throw new Error(getMessage(locale, 'errors.accessDenied'));
    }

    throw new Error(getMessage(locale, 'errors.dashboardLoad'));
  }

  return response.json();
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getCurrentLocale() {
  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isSupportedLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
}
