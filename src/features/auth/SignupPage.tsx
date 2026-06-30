import { FormEvent, useState } from "react";
import * as authApi from "./authApi";
import { AuthLayout } from "./AuthLayout";
import { friendlyAuthError } from "./authHelpers";

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
  const suffix = Math.floor(Math.random() * 10000);
  const [displayName, setDisplayName] = useState("Daniel Bevilacqua");
  const [username, setUsername] = useState(`daniel.test${suffix}`);
  const [email, setEmail] = useState(`daniel.test${suffix}@boom.local`);
  const [phoneNumber, setPhoneNumber] = useState("+5511999999999");
  const [country, setCountry] = useState("BR");
  const [documentType, setDocumentType] = useState("CPF");
  const [documentNumber, setDocumentNumber] = useState(`1234567${suffix}`.slice(0, 11));
  const [password, setPassword] = useState("BoomTest123!");
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
      setErrorMessage(friendlyAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create guardian account" subtitle="Create the responsible adult account.">
      <form className="auth-form auth-form-grid" onSubmit={handleSubmit}>
        <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required /></label>
        <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Phone<input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required /></label>
        <label>Country<input value={country} onChange={(event) => setCountry(event.target.value)} required /></label>
        <label>Document type<input value={documentType} onChange={(event) => setDocumentType(event.target.value)} required /></label>
        <label>Document number<input value={documentNumber} onChange={(event) => setDocumentNumber(event.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>

        {errorMessage && <div className="auth-error auth-form-full">{errorMessage}</div>}

        <button className="auth-form-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="auth-actions">
        <span>Already have an account?</span>
        <button className="auth-link-button" type="button" onClick={onLogin}>Sign in</button>
      </div>
    </AuthLayout>
  );
}
