import { FormEvent, useState } from "react";
import { useAuth } from "./AuthContext";
import { AuthLayout } from "./AuthLayout";
import { friendlyAuthError } from "./authHelpers";

export function LoginPage({
  onSignup,
  onLoggedIn,
}: {
  onSignup: () => void;
  onLoggedIn: () => void;
}) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("daniel.test");
  const [password, setPassword] = useState("BoomTest123!");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ identifier, password });
      onLoggedIn();
    } catch (error) {
      setErrorMessage(friendlyAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Access the parent dashboard.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username or email
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="auth-actions">
        <span>New to Boom?</span>
        <button className="auth-link-button" type="button" onClick={onSignup}>
          Create account
        </button>
      </div>
    </AuthLayout>
  );
}
