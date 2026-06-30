import { FormEvent, useMemo, useState } from "react";
import * as authApi from "./authApi";
import { AuthLayout } from "./AuthLayout";
import { createDevSignupDefaults, friendlyAuthError } from "./authHelpers";
import { getAuthTranslations, getStoredAuthLocale } from "./authTranslations";

export type VerificationState = {
  guardianId: string;
  username: string;
  devVerificationCode?: string | null;
};

export function SignupPage({
  onLogin,
  onVerificationRequired,
}: {
  onLogin: () => void;
  onVerificationRequired: (state: VerificationState) => void;
}) {
  const translations = useMemo(() => getAuthTranslations(getStoredAuthLocale()), []);
  const defaults = useMemo(() => createDevSignupDefaults(), []);

  const [displayName, setDisplayName] = useState(defaults.displayName);
  const [username, setUsername] = useState(defaults.username);
  const [email, setEmail] = useState(defaults.email);
  const [phoneNumber, setPhoneNumber] = useState(defaults.phoneNumber);
  const [country, setCountry] = useState(defaults.country);
  const [documentType, setDocumentType] = useState(defaults.documentType);
  const [documentNumber, setDocumentNumber] = useState(defaults.documentNumber);
  const [password, setPassword] = useState(defaults.password);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authApi.signup({
        displayName,
        username,
        email,
        phoneNumber,
        country,
        documentType,
        documentNumber,
        password,
      });

      onVerificationRequired({
        guardianId: response.guardianId,
        username,
        devVerificationCode: response.devVerificationCode,
      });
    } catch (error) {
      setErrorMessage(friendlyAuthError(error, translations));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title={translations.signup.title} subtitle={translations.signup.subtitle}>
      <form className="auth-form auth-form-grid" onSubmit={handleSubmit}>
        <label>{translations.signup.displayName}<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required /></label>
        <label>{translations.signup.username}<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
        <label>{translations.signup.email}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>{translations.signup.phone}<input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required /></label>
        <label>{translations.signup.country}<input value={country} onChange={(event) => setCountry(event.target.value)} required /></label>
        <label>{translations.signup.documentType}<input value={documentType} onChange={(event) => setDocumentType(event.target.value)} required /></label>
        <label>{translations.signup.documentNumber}<input value={documentNumber} onChange={(event) => setDocumentNumber(event.target.value)} required /></label>
        <label>{translations.signup.password}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>

        {errorMessage && <div className="auth-error auth-form-full">{errorMessage}</div>}

        <button className="auth-form-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? translations.signup.submitting : translations.signup.submit}
        </button>
      </form>

      <div className="auth-actions">
        <span>{translations.signup.alreadyHaveAccount}</span>
        <button className="auth-link-button" type="button" onClick={onLogin}>
          {translations.signup.signIn}
        </button>
      </div>
    </AuthLayout>
  );
}
