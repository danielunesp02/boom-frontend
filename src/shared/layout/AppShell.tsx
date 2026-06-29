import type { PropsWithChildren } from 'react';
import './AppShell.css';

export function AppShell({ children }: PropsWithChildren) {
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
            Dashboard
          </a>
          <a className="nav-item" href="/">
            Activities
          </a>
          <a className="nav-item" href="/">
            Action Plan
          </a>
          <a className="nav-item" href="/">
            Settings
          </a>
        </nav>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
}
