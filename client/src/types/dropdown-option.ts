export interface DropdownOption {
    option_id: string;
    question_id: string;
    content: string;
    is_correct: boolean;
    dropdown_question?: {
        question_id: string;
        content: string;
        // other fields...
    };
}

export interface DropdownOptionFormData {
    option_id?: string;
    question_id: string;
    content: string;
    is_correct: boolean;
}
