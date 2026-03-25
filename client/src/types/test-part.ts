export interface ITestPart {
  part_id: string;
  test_id: string;
  skill_id: string;
  part_name: string;
  order_index: number;
  test?: {
    test_id: string;
    test_name: string;
  };
  skill?: {
    id: string;
    skill_name: string;
  };
}
