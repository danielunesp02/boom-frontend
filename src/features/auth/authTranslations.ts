export type AuthLocale = "pt-BR" | "en-US";

export type AuthTranslations = {
  brand: { productName: string; subtitle: string };
  login: {
    title: string; subtitle: string; identifier: string; password: string;
    submit: string; submitting: string; newToBoom: string; createAccount: string;
  };
  signup: {
    title: string; subtitle: string; displayName: string; username: string; email: string;
    phone: string; country: string; documentType: string; documentNumber: string;
    password: string; submit: string; submitting: string; alreadyHaveAccount: string; signIn: string;
  };
  phoneVerification: {
    title: string; subtitle: string; devCodeLabel: string; code: string; submit: string; submitting: string;
    generateNewCode: string; backToLogin: string; verifiedMessage: string; newDevCodeGenerated: string; codeGenerated: string;
  };
  logout: { submit: string; submitting: string };
  protectedRoute: { checkingSession: string };
  errors: {
    generic: string; validation: string; accountNotActive: string; duplicateAccount: string;
    invalidCredentials: string; network: string;
  };
};

const messages: Record<AuthLocale, AuthTranslations> = {
  "pt-BR": {
    brand: { productName: "Boom", subtitle: "Plataforma de aprendizagem" },
    login: {
      title: "Entrar",
      subtitle: "Acesse o dashboard do responsável.",
      identifier: "Usuário ou e-mail",
      password: "Senha",
      submit: "Entrar",
      submitting: "Entrando...",
      newToBoom: "Novo no Boom?",
      createAccount: "Criar conta",
    },
    signup: {
      title: "Criar conta de responsável",
      subtitle: "Crie a conta do adulto responsável pelo acompanhamento do aluno.",
      displayName: "Nome de exibição",
      username: "Usuário",
      email: "E-mail",
      phone: "Telefone",
      country: "País",
      documentType: "Tipo de documento",
      documentNumber: "Número do documento",
      password: "Senha",
      submit: "Criar conta",
      submitting: "Criando...",
      alreadyHaveAccount: "Já tem uma conta?",
      signIn: "Entrar",
    },
    phoneVerification: {
      title: "Verificar telefone",
      subtitle: "Confirme o código de verificação do telefone.",
      devCodeLabel: "Código de verificação dev",
      code: "Código de verificação",
      submit: "Verificar telefone",
      submitting: "Verificando...",
      generateNewCode: "Gerar novo código",
      backToLogin: "Voltar para login",
      verifiedMessage: "Telefone verificado. Você já pode fazer login.",
      newDevCodeGenerated: "Novo código dev gerado.",
      codeGenerated: "Código de verificação gerado.",
    },
    logout: { submit: "Sair", submitting: "Saindo..." },
    protectedRoute: { checkingSession: "Verificando sessão..." },
    errors: {
      generic: "Algo deu errado. Tente novamente.",
      validation: "Revise os campos informados.",
      accountNotActive: "Conclua a verificação do telefone antes de fazer login.",
      duplicateAccount: "Este usuário, e-mail, telefone ou documento já está cadastrado.",
      invalidCredentials: "Usuário/e-mail ou senha inválidos.",
      network: "Não foi possível conectar ao servidor.",
    },
  },
  "en-US": {
    brand: { productName: "Boom", subtitle: "Learning platform" },
    login: {
      title: "Sign in",
      subtitle: "Access the parent dashboard.",
      identifier: "Username or email",
      password: "Password",
      submit: "Sign in",
      submitting: "Signing in...",
      newToBoom: "New to Boom?",
      createAccount: "Create account",
    },
    signup: {
      title: "Create guardian account",
      subtitle: "Create the responsible adult account for student monitoring.",
      displayName: "Display name",
      username: "Username",
      email: "Email",
      phone: "Phone",
      country: "Country",
      documentType: "Document type",
      documentNumber: "Document number",
      password: "Password",
      submit: "Create account",
      submitting: "Creating...",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Sign in",
    },
    phoneVerification: {
      title: "Verify phone",
      subtitle: "Confirm the phone verification code.",
      devCodeLabel: "Dev verification code",
      code: "Verification code",
      submit: "Verify phone",
      submitting: "Verifying...",
      generateNewCode: "Generate new code",
      backToLogin: "Back to login",
      verifiedMessage: "Phone verified. You can now sign in.",
      newDevCodeGenerated: "New dev code generated.",
      codeGenerated: "Verification code generated.",
    },
    logout: { submit: "Logout", submitting: "Signing out..." },
    protectedRoute: { checkingSession: "Checking session..." },
    errors: {
      generic: "Something went wrong. Please try again.",
      validation: "Please review the submitted fields.",
      accountNotActive: "Please complete phone verification before logging in.",
      duplicateAccount: "This username, email, phone, or document is already registered.",
      invalidCredentials: "Invalid username/email or password.",
      network: "Unable to connect to the server.",
    },
  },
};

export function resolveAuthLocale(locale?: string | null): AuthLocale {
  if (!locale) return "pt-BR";
  return locale.toLowerCase().startsWith("en") ? "en-US" : "pt-BR";
}

export function getStoredAuthLocale(): AuthLocale {
  return resolveAuthLocale(localStorage.getItem("boom.user.locale"));
}

export function getAuthTranslations(locale?: string | null): AuthTranslations {
  return messages[resolveAuthLocale(locale)];
}
