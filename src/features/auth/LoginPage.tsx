import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { AuthLayout } from "./AuthLayout";
import { friendlyAuthError } from "./authHelpers";
import { getAuthTranslations, getStoredAuthLocale } from "./authTranslations";

export function LoginPage({
  onSignup,
  onLoggedIn,
}: {
  onSignup: () => void;
  onLoggedIn: () => void;
}) {
  const translations = useMemo(() => getAuthTranslations(getStoredAuthLocale()), []);
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
      setErrorMessage(friendlyAuthError(error, translations));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title={translations.login.title} subtitle={translations.login.subtitle}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          {translations.login.identifier}
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
        </label>

        <label>
          {translations.login.password}
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? translations.login.submitting : translations.login.submit}
        </button>
      </form>

      <div className="auth-actions">
        <span>{translations.login.newToBoom}</span>
        <button className="auth-link-button" type="button" onClick={onSignup}>
          {translations.login.createAccount}
        </button>
      </div>
    </AuthLayout>
  );
}
