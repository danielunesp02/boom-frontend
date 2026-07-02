# STUDENT-005 — Student Flow Updates Parent Dashboard E2E

## Goal

Validate the full student-to-dashboard data pipeline.

## Covered pipeline

```text
Student completes activity in UI
Assessment attempt is completed
Answer submissions are stored
Learning events are emitted
Daily skill snapshot is updated automatically
Parent dashboard reads real snapshot data
Dashboard completed activities increases
Dashboard accuracy reflects the student flow
```

## Key detail

The test runs a snapshot rebuild only before the activity to normalize the baseline.

It does not run rebuild after the activity.

So, if the dashboard increments after the activity, automatic snapshot update is working.

## Command

```bash
npx playwright test e2e/student-flow-updates-parent-dashboard.spec.ts --workers=1
```

## Backend requirement

`AssessmentAttemptService.completeAttempt(...)` should update today's snapshot after emitting `ACTIVITY_COMPLETED`.

Temporary implementation:

```java
snapshotService.rebuildDailySnapshots(null);
```

Future implementation:

```text
event emitted
async job or queue
incremental snapshot update
dashboard refresh
```
