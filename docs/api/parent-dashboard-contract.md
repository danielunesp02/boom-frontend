# Parent Dashboard API Contract

## Endpoint

```text
GET /api/v1/parents/dashboard
```

## Purpose

Returns the first read-only parent dashboard view.

## Response

```json
{
  "student": {
    "id": "student-helena",
    "displayName": "Helena",
    "gradeLevel": "Lower Secondary",
    "targetSchoolSystem": "Italy - Scuola Secondaria di Primo Grado"
  },
  "weeklySummary": {
    "completedActivities": 5,
    "totalStudyTimeMinutes": 130,
    "averageAccuracy": 76,
    "currentStreakDays": 3
  },
  "activityHistory": [],
  "subjectPerformance": [],
  "learningGaps": [],
  "currentActionPlan": null,
  "recentActivitySummaries": [],
  "emptyState": null
}
```

## Access Control Rule

A parent/guardian must only receive dashboard data for linked students.

The current mock endpoint does not enforce this yet. This must be implemented when identity and guardian-student relationships are introduced.
