export interface QuizQuestion {
  id?: string;
  text: string;
  points: number;
  helpAllowed: boolean;
  minusPoints: number;
}
