export interface TfngAnswer {
  answer_id: string;
  question_id: string;
  correct_answer: 'TRUE' | 'FALSE' | 'NOT GIVEN';
  tfng_question?: {
    content?: string;
  };
}

export interface TfngAnswerFormData {
  answer_id: string;
  question_id: string;
  correct_answer: string;
}
