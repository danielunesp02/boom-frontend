import { useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { getAuthTranslations, getStoredAuthLocale } from "./authTranslations";

export function ProtectedRoute({
  children,
  onAnonymous,
}: {
  children: React.ReactNode;
  onAnonymous: () => void;
}) {
  const translations = useMemo(() => getAuthTranslations(getStoredAuthLocale()), []);
  const { status } = useAuth();

  useEffect(() => {
    if (status === "anonymous") onAnonymous();
  }, [status, onAnonymous]);

  if (status === "loading") {
    return (
      <main className="auth-page">
        <section className="auth-card">{translations.protectedRoute.checkingSession}</section>
      </main>
    );
  }

  if (status === "anonymous") return null;

  return <>{children}</>;
}
