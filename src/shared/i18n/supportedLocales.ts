export const SUPPORTED_LOCALES = [
  {
    code: 'en-US',
    label: 'English',
    shortLabel: 'EN'
  },
  {
    code: 'pt-BR',
    label: 'Português',
    shortLabel: 'PT'
  },
  {
    code: 'it-IT',
    label: 'Italiano',
    shortLabel: 'IT'
  },
  {
    code: 'es-ES',
    label: 'Español',
    shortLabel: 'ES'
  }
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]['code'];

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';
export const LOCALE_STORAGE_KEY = 'boom.user.locale';

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return SUPPORTED_LOCALES.some((locale) => locale.code === value);
}
