import { apiRequest } from "../../lib/apiClient";
import type { AuthUser, LoginRequest, PhoneVerificationResponse, SignupRequest, SignupResponse } from "./authTypes";

export function signup(request: SignupRequest): Promise<SignupResponse> {
  return apiRequest<SignupResponse>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function startPhoneVerification(guardianId: string): Promise<PhoneVerificationResponse> {
  return apiRequest<PhoneVerificationResponse>("/api/v1/auth/phone-verification/start", {
    method: "POST",
    body: JSON.stringify({ guardianId }),
  });
}

export function confirmPhoneVerification(guardianId: string, code: string): Promise<PhoneVerificationResponse> {
  return apiRequest<PhoneVerificationResponse>("/api/v1/auth/phone-verification/confirm", {
    method: "POST",
    body: JSON.stringify({ guardianId, code }),
  });
}

export function login(request: LoginRequest): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function me(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/v1/auth/me");
}

export function logout(): Promise<void> {
  return apiRequest<void>("/api/v1/auth/logout", {
    method: "POST",
  });
}
