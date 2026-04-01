export interface FillQuestion {
  question_id: string;
  content: string;
  // Included from join on questions table optionally:
  question?: any;
}
