export interface DoneQuiz {
  id?: string;
  pointsWon: number;
  timeLeft: number;
  userIdForSearch: number;
  quizIdForSearch: number;
  username: string;
}
