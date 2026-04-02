export interface Question {
    question_id: string;
    group_id: string;
    skill_id: string;
    question_type: 'DROPDOWN' | 'matching' | 'FILL' | 'MCQ'| 'tfng';
    order_index: number;
    created_at?: string;
    updated_at?: string;
}

export interface QuestionData {
    group_id: string;
    skill_id?: string;
    question_type: 'DROPDOWN' | 'matching' | 'FILL' | 'MCQ'| 'tfng';
    order_index: number;
}
