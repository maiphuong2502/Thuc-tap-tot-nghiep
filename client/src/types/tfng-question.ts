export interface TfngQuestion {
  question_id: string;
  content: string;
  question?: {
    skill_id?: string;
    group_id?: string;
    question_type?: string;
  };
}

export interface TfngQuestionFormData {
  question_id: string;
  content: string;
}
