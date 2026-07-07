export type MethodologyCode =
  | "LIGHT_REVIEW"
  | "BALANCED"
  | "INTENSIVE_REMEDIATION"
  | "EXAM_PREP";

export interface LearningCurvePoint {
  pointDate: string;
  weekIndex: number;
  actualMasteryScore: number | null;
  expectedMasteryScore: number;
  highPerformanceScore: number;
}

export interface SubjectLearningStrategy {
  studentId: string;
  subjectId: string;
  subjectName: string;
  methodologyCode: MethodologyCode;
  calibrationStatus: string;
  initialAssessmentScore: number | null;
  currentMasteryScore: number;
  expectedMasteryScore: number;
  highPerformanceTargetScore: number;
  weeklyStudyMinutesGoal: number;
  curveStartDate: string;
  targetDate: string | null;
  curvePoints: LearningCurvePoint[];
}

export interface UpdateSubjectLearningStrategyRequest {
  subjectId: string;
  methodologyCode: MethodologyCode;
  initialAssessmentScore: number | null;
  weeklyStudyMinutesGoal: number;
  curveStartDate?: string;
  targetDate?: string | null;
}
