import { Quiz } from './quiz';
import { QuizQuestion } from './quiz-question';
import { QuizProgress } from './quiz-progress';
import { User } from './user';

export class SaveQuizProgress {
  public user: User;
  public quizProgress: QuizProgress;
}
