export interface QuizProgress {
  id?: string;
  points: number;
  time: number;
  questionsAnswered: number;
  quizId: number;
  correctAns: number;
  wrongAns: number;
  skippedAns: number;
}
