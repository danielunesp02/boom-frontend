import type { PropsWithChildren } from 'react';
import { LocaleSwitcher } from '../i18n/LocaleSwitcher';
import { useI18n } from '../i18n/useI18n';
import './AppShell.css';

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useI18n();

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>Boom</strong>
            <span>Learning OS</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="nav-item nav-item-active" href="/">
            {t('app.dashboard')}
          </a>
          <a className="nav-item" href="/">
            {t('app.activities')}
          </a>
          <a className="nav-item" href="/">
            {t('app.actionPlan')}
          </a>
          <a className="nav-item" href="/">
            {t('app.settings')}
          </a>
        </nav>
      </aside>

      <main className="app-main">
        <div className="app-topbar">
          <LocaleSwitcher />
        </div>
        {children}
      </main>
    </div>
  );
}
