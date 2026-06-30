import { SUPPORTED_LOCALES, type SupportedLocale } from './supportedLocales';
import { useI18n } from './useI18n';
import './LocaleSwitcher.css';

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLocale(event.target.value as SupportedLocale);
  }

  return (
    <label className="locale-switcher">
      <span>{t('app.language')}</span>
      <select
        aria-label={t('app.language')}
        value={locale}
        onChange={handleChange}
        data-testid="locale-switcher"
      >
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <option key={supportedLocale.code} value={supportedLocale.code}>
            {supportedLocale.shortLabel} · {supportedLocale.label}
          </option>
        ))}
      </select>
    </label>
  );
}
