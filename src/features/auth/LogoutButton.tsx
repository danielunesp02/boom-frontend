import { useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { getAuthTranslations, getStoredAuthLocale } from "./authTranslations";

export function LogoutButton({ onLoggedOut }: { onLoggedOut: () => void }) {
  const translations = useMemo(() => getAuthTranslations(getStoredAuthLocale()), []);
  const { logout, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await logout();
      onLoggedOut();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-dashboard-bar">
      {user && <span>{user.displayName}</span>}
      <button className="auth-logout-button" type="button" onClick={handleLogout} disabled={isSubmitting}>
        {isSubmitting ? translations.logout.submitting : translations.logout.submit}
      </button>
    </div>
  );
}
