import { AppShell } from '../shared/layout/AppShell';
import { ParentDashboardPage } from '../features/parent-dashboard/pages/ParentDashboardPage';

export function App() {
  return (
    <AppShell>
      <ParentDashboardPage />
    </AppShell>
  );
}
