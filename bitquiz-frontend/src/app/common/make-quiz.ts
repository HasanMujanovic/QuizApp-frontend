import { Quiz } from './quiz';
import { QuizResponse } from './quiz-response';
import { QuizQuestion } from './quiz-question';
import { User } from './user';

export class MakeQuiz {
  public user: User;
  public quiz: Quiz;
  public quizQuestions: QuizQuestion[];
  public quizResponse: QuizResponse[];
}
