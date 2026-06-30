import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({
  children,
  onAnonymous,
}: {
  children: React.ReactNode;
  onAnonymous: () => void;
}) {
  const { status } = useAuth();

  useEffect(() => {
    if (status === "anonymous") {
      onAnonymous();
    }
  }, [status, onAnonymous]);

  if (status === "loading") {
    return (
      <main className="auth-page">
        <section className="auth-card">Checking session...</section>
      </main>
    );
  }

  if (status === "anonymous") {
    return null;
  }

  return <>{children}</>;
}
