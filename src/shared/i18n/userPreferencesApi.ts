import type { SupportedLocale } from './supportedLocales';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function saveUserLocalePreference(locale: SupportedLocale): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/v1/users/me/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ locale })
    });
  } catch {
    // Local persistence is enough for the current PoC.
    // Backend persistence will become mandatory once authentication is introduced.
  }
}
