import { useState } from "react";
import { useAuth } from "./AuthContext";

export function LogoutButton({ onLoggedOut }: { onLoggedOut: () => void }) {
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
        {isSubmitting ? "Signing out..." : "Logout"}
      </button>
    </div>
  );
}
