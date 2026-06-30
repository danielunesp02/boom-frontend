import { ApiError } from "../../lib/apiClient";

export function friendlyAuthError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.payload?.code === "ACCOUNT_NOT_ACTIVE") {
      return "Please complete phone verification before logging in.";
    }

    if (error.payload?.code === "VALIDATION_ERROR") {
      return "Please review the submitted fields.";
    }

    return error.payload?.detail ?? `Request failed with status ${error.status}`;
  }

  return "Something went wrong. Please try again.";
}
