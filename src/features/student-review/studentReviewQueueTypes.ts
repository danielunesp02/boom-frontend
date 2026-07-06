export interface StudentReviewQueueItem {
  reviewQueueId: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  skillId: string;
  skillName: string;
  status: string;
  reviewType: string;
  priority: string;
  reason: string;
  scheduledFor: string | null;
  overdueDays: number;
  requiresReassessment: boolean;
  accuracy: number | null;
  masteryStatus: string | null;
  estimatedMinutes: number;
  createdAt: string;
}

export interface StudentReviewQueueActionResponse {
  action: string;
  item: StudentReviewQueueItem;
}
