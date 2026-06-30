export type DashboardPeriodPreset =
    | "LAST_7_DAYS"
    | "LAST_30_DAYS"
    | "LAST_90_DAYS"
    | "CURRENT_MONTH"
    | "CUSTOM";

export type TrendDirection = "UP" | "DOWN" | "STABLE";

export type MetricSummary = {
  id: string;
  label: string;
  value: string;
  helperText: string;
  trendDirection: TrendDirection;
  trendLabel: string;
  trendPercent?: number;
  higherIsBetter: boolean;
};

export type ParentDashboard = {
  student: {
    id: string;
    displayName: string;
    gradeLevel: string;
    targetSchoolSystem: string;
  };

  weeklySummary: {
    completedActivities: number;
    totalStudyTimeMinutes: number;
    averageAccuracy: number;
    currentStreakDays: number;
  };

  selectedPeriod: {
    preset: DashboardPeriodPreset;
    startDate: string;
    endDate: string;
    comparisonStartDate: string;
    comparisonEndDate: string;
    label: string;
    comparisonLabel: string;
  };

  metrics: MetricSummary[];

  activityHistory: Array<{
    date: string;
    completedActivities: number;
    accuracy: number | null;
    studyTimeMinutes: number;
  }>;

  subjectPerformance: Array<{
    subjectId: string;
    subjectName: string;
    accuracy: number;
    studyTimeMinutes: number;
    trend: string;
    activeGapCount: number;
  }>;

  learningGaps: Array<{
    gapId: string;
    subjectName: string;
    topicName: string;
    skillName: string;
    severity: string;
    status: string;
    daysOpen: number;
    practiceTimeMinutes: number;
  }>;

  currentActionPlan: {
    actionPlanId: string;
    title: string;
    description: string;
    targetSubject: string;
    targetTopic: string;
    targetSkill: string;
    priority: string;
    estimatedEffortMinutes: number;
    progressPercentage: number;
    items: Array<{
      title: string;
      expectedDurationMinutes: number;
      status: string;
    }>;
  };

  recentActivitySummaries: Array<{
    activityId: string;
    date: string;
    activityTitle: string;
    subjectName: string;
    accuracy: number;
    durationMinutes: number;
    summaryText: string;
  }>;

  emptyState: null | {
    title?: string;
    description?: string;
  };
};