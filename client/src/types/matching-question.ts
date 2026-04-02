export interface MatchingQuestion {
    question_id: string;
    content: string;
    question?: {
        group_id?: string;
        skill_id?: string;
    };
}

export interface MatchingQuestionFormData {
    question_id: string;
    content: string;
}
