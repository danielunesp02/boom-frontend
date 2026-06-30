import { FormEvent, useMemo, useState } from "react";
import * as authApi from "./authApi";
import { AuthLayout } from "./AuthLayout";
import { friendlyAuthError } from "./authHelpers";
import { getAuthTranslations, getStoredAuthLocale } from "./authTranslations";
import type { VerificationState } from "./SignupPage";

export function PhoneVerificationPage({
  verification,
  onLogin,
  onVerificationUpdated,
}: {
  verification: VerificationState;
  onLogin: () => void;
  onVerificationUpdated: (state: VerificationState) => void;
}) {
  const translations = useMemo(() => getAuthTranslations(getStoredAuthLocale()), []);
  const [code, setCode] = useState(verification.devVerificationCode ?? "");
  const [devCode, setDevCode] = useState(verification.devVerificationCode ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await authApi.confirmPhoneVerification(verification.guardianId, code);
      setMessage(translations.phoneVerification.verifiedMessage);
      window.setTimeout(onLogin, 700);
    } catch (error) {
      setErrorMessage(friendlyAuthError(error, translations));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function generateNewCode() {
    setErrorMessage(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authApi.startPhoneVerification(verification.guardianId);
      setDevCode(response.devVerificationCode ?? null);
      setCode(response.devVerificationCode ?? "");
      onVerificationUpdated({ ...verification, devVerificationCode: response.devVerificationCode });
      setMessage(response.devVerificationCode ? translations.phoneVerification.newDevCodeGenerated : translations.phoneVerification.codeGenerated);
    } catch (error) {
      setErrorMessage(friendlyAuthError(error, translations));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title={translations.phoneVerification.title} subtitle={translations.phoneVerification.subtitle}>
      {devCode && (
        <div className="auth-dev-code">
          <span>{translations.phoneVerification.devCodeLabel}</span>
          <strong>{devCode}</strong>
        </div>
      )}

      <form className="auth-form" onSubmit={confirm}>
        <label>
          {translations.phoneVerification.code}
          <input value={code} onChange={(event) => setCode(event.target.value)} required />
        </label>

        {message && <div className="auth-success">{message}</div>}
        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? translations.phoneVerification.submitting : translations.phoneVerification.submit}
        </button>
      </form>

      <div className="auth-actions">
        <button className="auth-link-button" type="button" onClick={generateNewCode} disabled={isSubmitting}>
          {translations.phoneVerification.generateNewCode}
        </button>
        <button className="auth-link-button" type="button" onClick={onLogin}>
          {translations.phoneVerification.backToLogin}
        </button>
      </div>
    </AuthLayout>
  );
}
