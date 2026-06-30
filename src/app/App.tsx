import { useCallback, useState } from "react";
import { ParentDashboardPage } from "../features/dashboard/ParentDashboardPage";
import { AuthProvider, useAuth } from "../features/auth/AuthContext";
import { LoginPage } from "../features/auth/LoginPage";
import { LogoutButton } from "../features/auth/LogoutButton";
import { PhoneVerificationPage } from "../features/auth/PhoneVerificationPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { SignupPage, type VerificationState } from "../features/auth/SignupPage";

type View = "dashboard" | "login" | "signup" | "verify-phone";

function AppContent() {
  const { status } = useAuth();
  const [view, setView] = useState<View>("dashboard");
  const [verification, setVerification] = useState<VerificationState | null>(null);

  const goLogin = useCallback(() => setView("login"), []);

  if (view === "signup") {
    return (
      <SignupPage
        onLogin={goLogin}
        onVerificationRequired={(state) => {
          setVerification(state);
          setView("verify-phone");
        }}
      />
    );
  }

  if (view === "verify-phone" && verification) {
    return (
      <PhoneVerificationPage
        verification={verification}
        onLogin={goLogin}
        onVerificationUpdated={setVerification}
      />
    );
  }

  if (view === "login" || status === "anonymous") {
    return <LoginPage onSignup={() => setView("signup")} onLoggedIn={() => setView("dashboard")} />;
  }

  return (
    <ProtectedRoute onAnonymous={goLogin}>
      <LogoutButton onLoggedOut={goLogin} />
      <ParentDashboardPage />
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
