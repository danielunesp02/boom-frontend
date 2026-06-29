export type Trend = 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_DATA';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DashboardStudent = {
  id: string;
  displayName: string;
  gradeLevel: string;
  targetSchoolSystem: string;
};

export type WeeklySummary = {
  completedActivities: number;
  totalStudyTimeMinutes: number;
  averageAccuracy: number;
  currentStreakDays: number;
};

export type ActivityHistoryPoint = {
  date: string;
  completedActivities: number;
  accuracy: number | null;
  studyTimeMinutes: number;
};

export type SubjectPerformance = {
  subjectId: string;
  subjectName: string;
  accuracy: number;
  studyTimeMinutes: number;
  trend: Trend;
  activeGapCount: number;
};

export type LearningGap = {
  gapId: string;
  subjectName: string;
  topicName: string;
  skillName: string;
  severity: Severity;
  status: string;
  daysOpen: number;
  practiceTimeMinutes: number;
};

export type ActionPlanItem = {
  title: string;
  expectedDurationMinutes: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
};

export type CurrentActionPlan = {
  actionPlanId: string;
  title: string;
  description: string;
  targetSubject: string;
  targetTopic: string;
  targetSkill: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedEffortMinutes: number;
  progressPercentage: number;
  items: ActionPlanItem[];
};

export type RecentActivitySummary = {
  activityId: string;
  date: string;
  activityTitle: string;
  subjectName: string;
  accuracy: number;
  durationMinutes: number;
  summaryText: string;
};

export type ParentDashboardResponse = {
  student: DashboardStudent | null;
  weeklySummary: WeeklySummary;
  activityHistory: ActivityHistoryPoint[];
  subjectPerformance: SubjectPerformance[];
  learningGaps: LearningGap[];
  currentActionPlan: CurrentActionPlan | null;
  recentActivitySummaries: RecentActivitySummary[];
  emptyState?: {
    title: string;
    description: string;
  };
};
