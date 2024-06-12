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
    const questionUrl = `${environment.url}/playing/${id}/questions`;

    return this.http.get<QuizQuestion[]>(questionUrl);
  }
  getResponses(id: number): Observable<QuizResponse[]> {
    const responseUrl = `${environment.url}/playing/questions/${id}/responses`;

    return this.http.get<QuizResponse[]>(responseUrl);
  }
  searchForProgressWUserId(userId: number): Observable<QuizProgress[]> {
    const searchUrl = `${environment.url}/playing/users/${userId}/progress`;

    return this.http.get<QuizProgress[]>(searchUrl);
  }
}
