import type { DashboardPeriodPreset } from "./dashboardTypes";

export type DashboardLocale = "pt-BR" | "en-US";

export function resolveDashboardLocale(locale?: string | null): DashboardLocale {
  if (!locale) return "pt-BR";
  return locale.toLowerCase().startsWith("en") ? "en-US" : "pt-BR";
}

export function getDashboardTranslations(locale?: string | null) {
  return messages[resolveDashboardLocale(locale)];
}

export type DashboardTranslations = typeof messages["pt-BR"];

const messages = {
  "pt-BR": {
    pageEyebrow: "Dashboard dos responsáveis",
    pageTitleSuffix: "progresso",
    loading: "Carregando dashboard...",
    loadError: "Não foi possível carregar o dashboard",
    period: {
      ariaLabel: "Filtro de período do dashboard",
      label: "Período",
      presets: {
        LAST_7_DAYS: "Últimos 7 dias",
        LAST_30_DAYS: "Últimos 30 dias",
        LAST_90_DAYS: "Últimos 90 dias",
        CURRENT_MONTH: "Mês atual",
        CUSTOM: "Período customizado",
      } satisfies Record<DashboardPeriodPreset, string>,
      start: "Início",
      end: "Fim",
    },
    sections: {
      summary: "Resumo",
      activityHistory: "Histórico de atividades",
      activityHistorySubtitle: "Atividades + tempo",
      subjectPerformance: "Performance por matéria",
      learningGaps: "Gaps de aprendizagem",
      recentActivities: "Atividades recentes",
    },
    activity: {
      shortActivities: "ativ.",
      minutesSuffix: "m",
    },
    gaps: {
      openFor: "aberto há",
      days: "dias",
      practiced: "praticados",
    },
    actionPlan: {
      completed: "concluído",
      minutesSuffix: "m",
    },
    labels: {
      activeGaps: "gaps ativos",
    },
    enums: {
      IMPROVING: "Melhorando",
      STABLE: "Estável",
      DECLINING: "Piorando",
      MEDIUM: "Médio",
      LOW: "Baixo",
      HIGH: "Alto",
      IN_PROGRESS: "Em andamento",
      OPEN: "Aberto",
      COMPLETED: "Concluído",
      PENDING: "Pendente",
      ON_TRACK: "No caminho",
      ATTENTION: "Atenção",
    },
  },
  "en-US": {
    pageEyebrow: "Parent dashboard",
    pageTitleSuffix: "progress",
    loading: "Loading dashboard...",
    loadError: "Unable to load dashboard",
    period: {
      ariaLabel: "Dashboard period filter",
      label: "Period",
      presets: {
        LAST_7_DAYS: "Last 7 days",
        LAST_30_DAYS: "Last 30 days",
        LAST_90_DAYS: "Last 90 days",
        CURRENT_MONTH: "Current month",
        CUSTOM: "Custom range",
      } satisfies Record<DashboardPeriodPreset, string>,
      start: "Start",
      end: "End",
    },
    sections: {
      summary: "Summary",
      activityHistory: "Activity history",
      activityHistorySubtitle: "Activities + time",
      subjectPerformance: "Subject performance",
      learningGaps: "Learning gaps",
      recentActivities: "Recent activities",
    },
    activity: {
      shortActivities: "act.",
      minutesSuffix: "m",
    },
    gaps: {
      openFor: "open for",
      days: "days",
      practiced: "practiced",
    },
    actionPlan: {
      completed: "completed",
      minutesSuffix: "m",
    },
    labels: {
      activeGaps: "active gaps",
    },
    enums: {
      IMPROVING: "Improving",
      STABLE: "Stable",
      DECLINING: "Declining",
      MEDIUM: "Medium",
      LOW: "Low",
      HIGH: "High",
      IN_PROGRESS: "In progress",
      OPEN: "Open",
      COMPLETED: "Completed",
      PENDING: "Pending",
      ON_TRACK: "On track",
      ATTENTION: "Attention",
    },
  },
} as const;

export function enumLabel(translations: DashboardTranslations, value: string | null | undefined): string {
  if (!value) return "";
  return translations.enums[value as keyof DashboardTranslations["enums"]] ?? value;
}
