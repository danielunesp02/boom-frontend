import { parentDashboardMock } from '../data/parentDashboard.mock';
import type { ParentDashboardResponse } from '../types/parentDashboardTypes';
import { getMessage } from '../../../shared/i18n/messages';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isSupportedLocale,
  type SupportedLocale
} from '../../../shared/i18n/supportedLocales';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function fetchParentDashboard(
  requestedLocale?: SupportedLocale
): Promise<ParentDashboardResponse> {
  const locale = requestedLocale ?? getCurrentLocale();

  if (USE_MOCKS) {
    await wait(250);
    return parentDashboardMock;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/parents/dashboard`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': locale,
      'X-Boom-Locale': locale
    }
  });

  if (!response.ok) {
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

function getCurrentLocale(): SupportedLocale {
  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isSupportedLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
}
