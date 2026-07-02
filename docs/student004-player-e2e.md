# STUDENT-004 — Student Activity Player E2E

## Goal

Lock the full student activity player journey with Playwright.

## Covered journey

```text
login as guardian
seed Helena
seed taxonomy
seed learning activities
open student player
start attempt
answer first question
check answer
see AI feedback
answer second question
finish activity
validate completed attempt through backend API
```

## Test file

```text
e2e/student-activity-player-attempt-flow.spec.ts
```

## Command

```bash
npx playwright test e2e/student-activity-player-attempt-flow.spec.ts --workers=1
```

## Required backend

```text
LEARN-002 Learning Activities
STUDENT-001 Activity Player Backend
LEARN-004 Assessment Attempts
```

## Required frontend

```text
STUDENT-002 Activity Player UI
STUDENT-003 Player Attempts Integration
```

## Required route

```text
/student/activity?studentId=<studentId>&activityId=<activityId>
```

## What this test protects

```text
authenticated access
student ownership access
activity loading
attempt creation
answer submission
backend correctness calculation
mock AI feedback display
attempt completion
score and accuracy persistence
```

## Notes

The test intentionally verifies the attempt via backend API after the UI flow.

That makes the test stronger than only checking the screen, because it validates persistence too.
