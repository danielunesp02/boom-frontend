# Frontend Integration — LEARN-004 Player Attempts

## Previous flow

```text
Select answer -> Next
```

## New flow

```text
Load player
Start attempt
Select answer
Check answer
Show backend correctness
Show mock AI feedback
Next question
Complete attempt
Show result
```

## Backend endpoints used

```http
GET  /api/v1/students/{studentId}/activities/{activityId}/player
POST /api/v1/students/{studentId}/activities/{activityId}/attempts
POST /api/v1/attempts/{attemptId}/answers
POST /api/v1/attempts/{attemptId}/complete
```

## UX states

```text
loading
ready
selecting
submitting
submitted
completed
error
```

## Security principle

The frontend does not know the correct answer before submission.

Correctness comes only from:

```text
POST /api/v1/attempts/{attemptId}/answers
```

## Current limitations

```text
No real retry flow yet
No persisted timer by question beyond submitted seconds
No student_learning_events yet
No real AI provider yet
No route guard specific to student player yet
```

## Next improvements

```text
E2E test for activity attempt flow
animation polish
real result screen with per-question review
student_learning_events
AI mock completion summary
real AI provider adapter later
```
