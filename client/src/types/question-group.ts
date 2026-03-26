export interface IQuestionGroup {
  group_id: string;
  skill_id: string;
  title: string;
  passage_id: string | null;
  audio_id: string | null;
  type: string;
  skill?: {
    id: string;
    skill_name: string;
  };
  passage?: {
    passage_id: string;
    title: string;
  };
  audio?: {
    audio_id: string;
    audio_file: string;
  };
}
