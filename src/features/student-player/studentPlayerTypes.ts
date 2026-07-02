export type StudentPlayerAiMessage = {
  tone: string;
  message: string;
};

export type StudentPlayerStudent = {
  studentId: string;
  displayName: string;
  gradeLevel: string;
  targetSchoolSystem: string;
  preferredLocale: string;
};

export type StudentPlayerActivity = {
  activityId: string;
  code: string;
  title: string;
  description: string;
  subjectId: string;
  topicId: string;
  skillId: string;
  objectiveId: string | null;
  activityType: string;
  estimatedDurationMinutes: number;
  complexityLevel: string;
  depthLevel: string;
};

export type StudentPlayerOption = {
  optionId: string;
  label: string;
  text: string;
  displayOrder: number;
};

export type StudentPlayerQuestion = {
  questionId: string;
  code: string;
  prompt: string;
  questionType: string;
  complexityLevel: string;
  depthLevel: string;
  displayOrder: number;
  hint: StudentPlayerAiMessage;
  options: StudentPlayerOption[];
};

export type StudentPlayerAiCoach = {
  coachName: string;
  avatarKey: string;
  introMessage: StudentPlayerAiMessage;
  completionPreview: StudentPlayerAiMessage;
};

export type StudentActivityPlayerResponse = {
  student: StudentPlayerStudent;
  activity: StudentPlayerActivity;
  aiCoach: StudentPlayerAiCoach;
  questions: StudentPlayerQuestion[];
};

export type StartAttemptRequest = {
  sourceChannel: "WEB" | "MOBILE" | "TABLET" | "TV" | "API";
  locale: string;
};

export type AiCoachFeedbackResponse = {
  tone: string;
  message: string;
};

export type AnswerSubmissionResponse = {
  answerSubmissionId: string;
  attemptId: string;
  questionId: string;
  selectedOptionId: string | null;
  textAnswer: string | null;
  correct: boolean;
  score: number;
  timeSpentSeconds: number | null;
  submittedAt: string;
  aiFeedback: AiCoachFeedbackResponse | null;
};

export type AssessmentAttemptResponse = {
  attemptId: string;
  studentId: string;
  activityId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  sourceChannel: string;
  locale: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number;
  accuracy: number;
  startedAt: string;
  completedAt: string | null;
  answers: AnswerSubmissionResponse[];
};

export type SubmitAnswerRequest = {
  questionId: string;
  selectedOptionId?: string;
  textAnswer?: string;
  timeSpentSeconds?: number;
};
