export interface MatchingAnswer {
    answer_id: string;
    question_id: string;
    left_item: string;
    right_item: string;
}

export interface MatchingAnswerFormData {
    answer_id?: string;
    question_id: string;
    left_item: string;
    right_item: string;
}
