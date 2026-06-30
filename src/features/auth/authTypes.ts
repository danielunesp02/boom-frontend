export type AuthUser = {
  guardianId: string;
  displayName: string;
  username: string;
  email: string;
  status: string;
};

export type SignupRequest = {
  displayName: string;
  username: string;
  email: string;
  phoneNumber: string;
  country: string;
  documentType: string;
  documentNumber: string;
  password: string;
};

export type SignupResponse = {
  guardianId: string;
  status: string;
  phoneNumberMasked: string;
  message: string;
  devVerificationCode?: string | null;
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type PhoneVerificationResponse = {
  guardianId: string;
  status: string;
  message: string;
  devVerificationCode?: string | null;
};
