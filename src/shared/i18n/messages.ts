import type { SupportedLocale } from './supportedLocales';

export const messages = {
  'en-US': {
    app: {
      dashboard: 'Dashboard',
      activities: 'Activities',
      actionPlan: 'Action Plan',
      settings: 'Settings',
      selectedStudent: 'Selected student',
      language: 'Language'
    },
    dashboard: {
      titleFallback: 'Student progress',
      loadingTitle: 'Loading student dashboard',
      subtitleFallback: 'Learning history, performance and current action plan.',
      parentDashboard: 'Parent dashboard',
      completedActivities: 'Completed activities',
      completedActivitiesDetail: 'This week',
      studyTime: 'Study time',
      studyTimeDetail: 'Total focused time',
      averageAccuracy: 'Average accuracy',
      averageAccuracyDetail: 'Across completed activities',
      currentStreak: 'Current streak',
      currentStreakDetail: 'Learning rhythm',
      days: 'days',
      minutesShort: 'min',
      loading: 'Loading dashboard...',
      errorTitle: 'We could not load the dashboard',
      tryAgain: 'Try again',
      noActivityTitle: 'No learning activity yet',
      noActivityDescription:
        'Once the student completes the first activity, this dashboard will show progress, performance and the current action plan.'
    },
    charts: {
      activityHistory: 'Activity history',
      activityHistoryDescription: 'Study time and accuracy over the last 7 days.'
    },
    subjectPerformance: {
      title: 'Performance by subject',
      description: 'Accuracy, study time and current trend.',
      activeGaps: 'active gaps'
    },
    gaps: {
      title: 'Attention areas',
      description: 'Topics that need continued practice.',
      daysOpen: 'days open',
      practiceMinutes: 'minutes of practice'
    },
    actionPlan: {
      title: 'Current action plan',
      empty: 'There is no active action plan right now.',
      progress: 'Progress'
    },
    recentActivity: {
      title: 'Recent activity summaries',
      description: 'Parent-friendly summaries generated after each learning delivery.'
    },
    errors: {
      accessDenied: 'You do not have access to this student dashboard.',
      dashboardLoad: 'Unable to load the parent dashboard.',
      unexpected: 'Unexpected dashboard error.'
    }
  },

  'pt-BR': {
    app: {
      dashboard: 'Dashboard',
      activities: 'Atividades',
      actionPlan: 'Plano de ação',
      settings: 'Configurações',
      selectedStudent: 'Aluno selecionado',
      language: 'Idioma'
    },
    dashboard: {
      titleFallback: 'Progresso do aluno',
      loadingTitle: 'Carregando dashboard do aluno',
      subtitleFallback: 'Histórico de aprendizagem, performance e plano de ação atual.',
      parentDashboard: 'Dashboard dos pais',
      completedActivities: 'Atividades concluídas',
      completedActivitiesDetail: 'Nesta semana',
      studyTime: 'Tempo de estudo',
      studyTimeDetail: 'Tempo total focado',
      averageAccuracy: 'Aproveitamento médio',
      averageAccuracyDetail: 'Nas atividades concluídas',
      currentStreak: 'Sequência atual',
      currentStreakDetail: 'Ritmo de aprendizagem',
      days: 'dias',
      minutesShort: 'min',
      loading: 'Carregando dashboard...',
      errorTitle: 'Não foi possível carregar o dashboard',
      tryAgain: 'Tentar novamente',
      noActivityTitle: 'Ainda não há atividade de aprendizagem',
      noActivityDescription:
        'Quando o aluno concluir a primeira atividade, este dashboard mostrará progresso, performance e plano de ação atual.'
    },
    charts: {
      activityHistory: 'Histórico de atividades',
      activityHistoryDescription: 'Tempo de estudo e aproveitamento nos últimos 7 dias.'
    },
    subjectPerformance: {
      title: 'Performance por disciplina',
      description: 'Aproveitamento, tempo de estudo e tendência atual.',
      activeGaps: 'gaps ativos'
    },
    gaps: {
      title: 'Pontos de atenção',
      description: 'Assuntos que precisam de prática contínua.',
      daysOpen: 'dias em aberto',
      practiceMinutes: 'minutos de prática'
    },
    actionPlan: {
      title: 'Plano de ação atual',
      empty: 'Não há plano de ação ativo neste momento.',
      progress: 'Progresso'
    },
    recentActivity: {
      title: 'Resumos de atividades recentes',
      description: 'Resumos amigáveis para os pais gerados após cada entrega de aprendizagem.'
    },
    errors: {
      accessDenied: 'Você não tem acesso ao dashboard deste aluno.',
      dashboardLoad: 'Não foi possível carregar o dashboard dos pais.',
      unexpected: 'Erro inesperado no dashboard.'
    }
  },

  'it-IT': {
    app: {
      dashboard: 'Dashboard',
      activities: 'Attività',
      actionPlan: 'Piano di azione',
      settings: 'Impostazioni',
      selectedStudent: 'Studente selezionato',
      language: 'Lingua'
    },
    dashboard: {
      titleFallback: 'Progresso dello studente',
      loadingTitle: 'Caricamento dashboard dello studente',
      subtitleFallback: 'Storico di apprendimento, performance e piano di azione attuale.',
      parentDashboard: 'Dashboard genitori',
      completedActivities: 'Attività completate',
      completedActivitiesDetail: 'Questa settimana',
      studyTime: 'Tempo di studio',
      studyTimeDetail: 'Tempo totale di concentrazione',
      averageAccuracy: 'Rendimento medio',
      averageAccuracyDetail: 'Nelle attività completate',
      currentStreak: 'Serie attuale',
      currentStreakDetail: 'Ritmo di apprendimento',
      days: 'giorni',
      minutesShort: 'min',
      loading: 'Caricamento dashboard...',
      errorTitle: 'Non è stato possibile caricare la dashboard',
      tryAgain: 'Riprova',
      noActivityTitle: 'Nessuna attività di apprendimento ancora',
      noActivityDescription:
        'Quando lo studente completa la prima attività, questa dashboard mostrerà progresso, performance e piano di azione attuale.'
    },
    charts: {
      activityHistory: 'Storico attività',
      activityHistoryDescription: 'Tempo di studio e rendimento negli ultimi 7 giorni.'
    },
    subjectPerformance: {
      title: 'Performance per materia',
      description: 'Rendimento, tempo di studio e tendenza attuale.',
      activeGaps: 'gap attivi'
    },
    gaps: {
      title: 'Aree di attenzione',
      description: 'Argomenti che richiedono pratica continua.',
      daysOpen: 'giorni aperti',
      practiceMinutes: 'minuti di pratica'
    },
    actionPlan: {
      title: 'Piano di azione attuale',
      empty: 'Non esiste un piano di azione attivo al momento.',
      progress: 'Progresso'
    },
    recentActivity: {
      title: 'Riepiloghi attività recenti',
      description: 'Riepiloghi semplici per i genitori generati dopo ogni attività.'
    },
    errors: {
      accessDenied: 'Non hai accesso alla dashboard di questo studente.',
      dashboardLoad: 'Impossibile caricare la dashboard genitori.',
      unexpected: 'Errore imprevisto nella dashboard.'
    }
  },

  'es-ES': {
    app: {
      dashboard: 'Panel',
      activities: 'Actividades',
      actionPlan: 'Plan de acción',
      settings: 'Configuración',
      selectedStudent: 'Estudiante seleccionado',
      language: 'Idioma'
    },
    dashboard: {
      titleFallback: 'Progreso del estudiante',
      loadingTitle: 'Cargando panel del estudiante',
      subtitleFallback: 'Historial de aprendizaje, rendimiento y plan de acción actual.',
      parentDashboard: 'Panel para padres',
      completedActivities: 'Actividades completadas',
      completedActivitiesDetail: 'Esta semana',
      studyTime: 'Tiempo de estudio',
      studyTimeDetail: 'Tiempo total enfocado',
      averageAccuracy: 'Rendimiento medio',
      averageAccuracyDetail: 'En actividades completadas',
      currentStreak: 'Racha actual',
      currentStreakDetail: 'Ritmo de aprendizaje',
      days: 'días',
      minutesShort: 'min',
      loading: 'Cargando panel...',
      errorTitle: 'No fue posible cargar el panel',
      tryAgain: 'Intentar de nuevo',
      noActivityTitle: 'Aún no hay actividad de aprendizaje',
      noActivityDescription:
        'Cuando el estudiante complete la primera actividad, este panel mostrará progreso, rendimiento y plan de acción actual.'
    },
    charts: {
      activityHistory: 'Historial de actividades',
      activityHistoryDescription: 'Tiempo de estudio y rendimiento en los últimos 7 días.'
    },
    subjectPerformance: {
      title: 'Rendimiento por asignatura',
      description: 'Rendimiento, tiempo de estudio y tendencia actual.',
      activeGaps: 'brechas activas'
    },
    gaps: {
      title: 'Áreas de atención',
      description: 'Temas que necesitan práctica continua.',
      daysOpen: 'días abiertos',
      practiceMinutes: 'minutos de práctica'
    },
    actionPlan: {
      title: 'Plan de acción actual',
      empty: 'No hay un plan de acción activo en este momento.',
      progress: 'Progreso'
    },
    recentActivity: {
      title: 'Resúmenes de actividades recientes',
      description: 'Resúmenes simples para padres generados después de cada entrega de aprendizaje.'
    },
    errors: {
      accessDenied: 'No tienes acceso al panel de este estudiante.',
      dashboardLoad: 'No fue posible cargar el panel para padres.',
      unexpected: 'Error inesperado en el panel.'
    }
  }
} as const;

export type MessageKey =
  | 'app.dashboard'
  | 'app.activities'
  | 'app.actionPlan'
  | 'app.settings'
  | 'app.selectedStudent'
  | 'app.language'
  | 'dashboard.titleFallback'
  | 'dashboard.loadingTitle'
  | 'dashboard.subtitleFallback'
  | 'dashboard.parentDashboard'
  | 'dashboard.completedActivities'
  | 'dashboard.completedActivitiesDetail'
  | 'dashboard.studyTime'
  | 'dashboard.studyTimeDetail'
  | 'dashboard.averageAccuracy'
  | 'dashboard.averageAccuracyDetail'
  | 'dashboard.currentStreak'
  | 'dashboard.currentStreakDetail'
  | 'dashboard.days'
  | 'dashboard.minutesShort'
  | 'dashboard.loading'
  | 'dashboard.errorTitle'
  | 'dashboard.tryAgain'
  | 'dashboard.noActivityTitle'
  | 'dashboard.noActivityDescription'
  | 'charts.activityHistory'
  | 'charts.activityHistoryDescription'
  | 'subjectPerformance.title'
  | 'subjectPerformance.description'
  | 'subjectPerformance.activeGaps'
  | 'gaps.title'
  | 'gaps.description'
  | 'gaps.daysOpen'
  | 'gaps.practiceMinutes'
  | 'actionPlan.title'
  | 'actionPlan.empty'
  | 'actionPlan.progress'
  | 'recentActivity.title'
  | 'recentActivity.description'
  | 'errors.accessDenied'
  | 'errors.dashboardLoad'
  | 'errors.unexpected';

export function getMessage(locale: SupportedLocale, key: MessageKey): string {
  const parts = key.split('.');
  let current: unknown = messages[locale];

  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return key;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : key;
}
