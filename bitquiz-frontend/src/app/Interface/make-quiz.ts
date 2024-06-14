import { Quiz } from './quiz';
import { QuizResponse } from './quiz-response';
import { QuizQuestion } from './quiz-question';
import { User } from './user';

export interface MakeQuiz {
  user: User;
  quiz: Quiz;
  quizQuestions: QuizQuestion[];
  quizResponse: QuizResponse[];
}
