# STUDENT-006 — Safe Attempt Completion Frontend Fix

## Goal

Guarantee that the student player only shows the final completed screen after the backend confirms that the assessment attempt was persisted as `COMPLETED`.

## Problem found by E2E

The UI displayed the completed screen, but the backend still returned `status = IN_PROGRESS`.

## Fix

This package updates:

```text
src/features/student-player/studentPlayerApi.ts
src/features/student-player/StudentActivityPlayerPage.tsx
```

The player now:

```text
click Finish
POST /api/v1/attempts/{attemptId}/complete
require response status COMPLETED
only then show completed screen
```

If the backend returns `IN_PROGRESS`, the player remains on the question screen and shows an inline error.

## Apply

```bash
cd /tmp
unzip ~/Downloads/boom-student006-safe-attempt-completion-frontend-pack.zip -d boom-student006-safe-attempt-completion-frontend-pack

cd ~/projects/boom/boom-frontend
cp -R /tmp/boom-student006-safe-attempt-completion-frontend-pack/boom-frontend-patch/* .
```

## Validate

```bash
npm run build
npx playwright test e2e/student-flow-updates-parent-dashboard.spec.ts --workers=1
```

## Commit

```bash
git add src/features/student-player/studentPlayerApi.ts \
  src/features/student-player/StudentActivityPlayerPage.tsx \
  docs/student006-safe-attempt-completion.md

git commit -m "fix: require backend confirmation before completing student activity"
```
