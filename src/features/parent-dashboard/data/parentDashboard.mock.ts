import type { ParentDashboardResponse } from '../types/parentDashboardTypes';

export const parentDashboardMock: ParentDashboardResponse = {
  student: {
    id: 'student-helena',
    displayName: 'Helena',
    gradeLevel: 'Lower Secondary',
    targetSchoolSystem: 'Italy - Scuola Secondaria di Primo Grado'
  },
  weeklySummary: {
    completedActivities: 5,
    totalStudyTimeMinutes: 130,
    averageAccuracy: 76,
    currentStreakDays: 3
  },
  activityHistory: [
    { date: '2026-06-23', completedActivities: 1, accuracy: 68, studyTimeMinutes: 20 },
    { date: '2026-06-24', completedActivities: 1, accuracy: 72, studyTimeMinutes: 25 },
    { date: '2026-06-25', completedActivities: 0, accuracy: null, studyTimeMinutes: 0 },
    { date: '2026-06-26', completedActivities: 1, accuracy: 76, studyTimeMinutes: 30 },
    { date: '2026-06-27', completedActivities: 1, accuracy: 82, studyTimeMinutes: 25 },
    { date: '2026-06-28', completedActivities: 1, accuracy: 81, studyTimeMinutes: 30 },
    { date: '2026-06-29', completedActivities: 0, accuracy: null, studyTimeMinutes: 0 }
  ],
  subjectPerformance: [
    {
      subjectId: 'math',
      subjectName: 'Mathematics',
      accuracy: 68,
      studyTimeMinutes: 55,
      trend: 'IMPROVING',
      activeGapCount: 2
    },
    {
      subjectId: 'english',
      subjectName: 'English',
      accuracy: 84,
      studyTimeMinutes: 35,
      trend: 'STABLE',
      activeGapCount: 0
    },
    {
      subjectId: 'science',
      subjectName: 'Science',
      accuracy: 73,
      studyTimeMinutes: 40,
      trend: 'IMPROVING',
      activeGapCount: 1
    }
  ],
  learningGaps: [
    {
      gapId: 'gap-fractions',
      subjectName: 'Mathematics',
      topicName: 'Fractions',
      skillName: 'Equivalent fractions',
      severity: 'MEDIUM',
      status: 'IN_PROGRESS',
      daysOpen: 6,
      practiceTimeMinutes: 45
    },
    {
      gapId: 'gap-science-charts',
      subjectName: 'Science',
      topicName: 'Scientific charts',
      skillName: 'Interpret chart evidence',
      severity: 'LOW',
      status: 'OPEN',
      daysOpen: 2,
      practiceTimeMinutes: 18
    }
  ],
  currentActionPlan: {
    actionPlanId: 'plan-fractions',
    title: 'Review equivalent fractions',
    description:
      'Practice visual comparison of equivalent fractions before moving to proportional reasoning.',
    targetSubject: 'Mathematics',
    targetTopic: 'Fractions',
    targetSkill: 'Equivalent fractions',
    priority: 'MEDIUM',
    estimatedEffortMinutes: 45,
    progressPercentage: 40,
    items: [
      {
        title: 'Review visual explanation',
        expectedDurationMinutes: 10,
        status: 'COMPLETED'
      },
      {
        title: 'Practice 10 visual fraction questions',
        expectedDurationMinutes: 20,
        status: 'IN_PROGRESS'
      },
      {
        title: 'Retry short challenge',
        expectedDurationMinutes: 15,
        status: 'PENDING'
      }
    ]
  },
  recentActivitySummaries: [
    {
      activityId: 'act-2026-06-28',
      date: '2026-06-28',
      activityTitle: 'Fractions practice',
      subjectName: 'Mathematics',
      accuracy: 81,
      durationMinutes: 30,
      summaryText:
        'Helena improved in visual comparison but still needs practice recognizing equivalent fractions quickly.'
    },
    {
      activityId: 'act-2026-06-27',
      date: '2026-06-27',
      activityTitle: 'Reading comprehension',
      subjectName: 'English',
      accuracy: 88,
      durationMinutes: 25,
      summaryText:
        'Strong performance identifying the main idea and supporting details in short texts.'
    }
  ]
};

export const emptyDashboardMock: ParentDashboardResponse = {
  student: {
    id: 'student-new',
    displayName: 'New Student',
    gradeLevel: 'Lower Secondary',
    targetSchoolSystem: 'Not configured yet'
  },
  weeklySummary: {
    completedActivities: 0,
    totalStudyTimeMinutes: 0,
    averageAccuracy: 0,
    currentStreakDays: 0
  },
  activityHistory: [],
  subjectPerformance: [],
  learningGaps: [],
  currentActionPlan: null,
  recentActivitySummaries: [],
  emptyState: {
    title: 'No learning activity yet',
    description:
      'Once the student completes the first activity, this dashboard will show progress, performance and the current action plan.'
  }
};
