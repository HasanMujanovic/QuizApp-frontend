import { Quiz } from './quiz';
import { User } from './user';
import { DoneQuiz } from './done-quiz';

export interface SaveDoneQuiz {
  quiz: Quiz;
  user: User;
  doneQuiz: DoneQuiz;
}
