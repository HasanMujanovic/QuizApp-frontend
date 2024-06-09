import { Injectable } from '@angular/core';
import { QuizQuestion } from '../common/quiz-question';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QuizResponse } from '../common/quiz-response';
import { environment } from '../../environments/environment';
import { QuizProgress } from '../common/quiz-progress';
import { Quiz } from '../common/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizPlayingService {
  currentQuestion: number = 0;
  timeLeft: number;
  isThereProgress: boolean = false;
  points: number = 0;

  isQuizDone: boolean = false;
  constructor(private http: HttpClient) {}

  getQuestions(id: number): Observable<QuizQuestion[]> {
    const questionUrl = `${environment.url}/quizes/${id}/questions`;

    return this.http
      .get<getQuestions>(questionUrl)
      .pipe(map((res) => res._embedded.quizQuestionses));
  }
  getResponses(id: number): Observable<QuizResponse[]> {
    const responseUrl = `${environment.url}/quiz-questions/${id}/responses`;

    return this.http
      .get<getResponses>(responseUrl)
      .pipe(map((res) => res._embedded.quizResponses));
  }
  searchForProgressWUserId(userId: number): Observable<QuizProgress[]> {
    const searchUrl = `${environment.url}/users/${userId}/kvizProgres`;

    return this.http
      .get<getProgress>(searchUrl)
      .pipe(map((res) => res._embedded.quizProgresses));
  }
}
interface getProgress {
  _embedded: {
    quizProgresses: QuizProgress[];
  };
}

interface getQuestions {
  _embedded: {
    quizQuestionses: QuizQuestion[];
  };
}

interface getResponses {
  _embedded: {
    quizResponses: QuizResponse[];
  };
}
