import { getAuthTranslations, getStoredAuthLocale } from "./authTranslations";
import "./auth.css";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const translations = getAuthTranslations(getStoredAuthLocale());

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">B</span>
          <div>
            <strong>{translations.brand.productName}</strong>
            <div>{translations.brand.subtitle}</div>
          </div>
        </div>

        <header className="auth-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        {children}
      </section>
    </main>
  );
}
