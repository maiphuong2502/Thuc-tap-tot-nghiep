export interface DropdownQuestion {
  question_id: string;
  content: string;
  question?: {
    group_id?: string;
    skill_id?: string;
    question_type?: string;
  };
}
