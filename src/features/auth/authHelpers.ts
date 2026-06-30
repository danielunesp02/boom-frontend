import { ApiError } from "../../lib/apiClient";
import type { AuthTranslations } from "./authTranslations";

export function friendlyAuthError(error: unknown, translations: AuthTranslations): string {
  if (error instanceof TypeError) return translations.errors.network;

  if (error instanceof ApiError) {
    const code = error.payload?.code;

    if (code === "ACCOUNT_NOT_ACTIVE") return translations.errors.accountNotActive;
    if (code === "VALIDATION_ERROR") return translations.errors.validation;

    if (
      code === "DUPLICATE_ACCOUNT" ||
      code === "ACCOUNT_ALREADY_EXISTS" ||
      code === "AUTH_DUPLICATE_ACCOUNT" ||
      code === "CONFLICT" ||
      error.status === 409
    ) {
      return translations.errors.duplicateAccount;
    }

    if (
      code === "INVALID_CREDENTIALS" ||
      code === "BAD_CREDENTIALS" ||
      code === "UNAUTHORIZED" ||
      error.status === 401
    ) {
      return translations.errors.invalidCredentials;
    }

    return error.payload?.detail ?? translations.errors.generic;
  }

  return translations.errors.generic;
}

export function createDevSignupDefaults() {
  const suffix = Date.now().toString().slice(-7);
  const phoneSuffix = suffix.slice(-6).padStart(6, "0");
  const documentNumber = `1234${suffix}`.slice(0, 11);

  return {
    displayName: `Daniel Bevilacqua ${suffix}`,
    username: `daniel.test${suffix}`,
    email: `daniel.test${suffix}@boom.local`,
    phoneNumber: `+5511991${phoneSuffix}`,
    country: "BR",
    documentType: "CPF",
    documentNumber,
    password: "BoomTest123!",
  };
}
