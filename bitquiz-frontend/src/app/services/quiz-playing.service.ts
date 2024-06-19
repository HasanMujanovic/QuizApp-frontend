import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { QuizQuestion } from '../Interface/quiz-question';
import { QuizResponse } from '../Interface/quiz-response';
import { QuizProgress } from '../Interface/quiz-progress';

@Injectable({
  providedIn: 'root',
})
export class QuizPlayingService {
  constructor(private http: HttpClient) {}

  getQuestions(id: number): Observable<QuizQuestion[]> {
    const questionUrl = `${environment.url}/playing/${id}/questions`;

    return this.http.get<QuizQuestion[]>(questionUrl).pipe(
      catchError((error) => {
        console.error('Error while getting questions:', error);
        return of(null);
      })
    );
  }
  getResponses(id: number): Observable<QuizResponse[]> {
    const responseUrl = `${environment.url}/playing/questions/${id}/responses`;

    return this.http.get<QuizResponse[]>(responseUrl).pipe(
      catchError((error) => {
        console.error('Error while getting responses:', error);
        return of(null);
      })
    );
  }
  searchForProgressWUserId(userId: number): Observable<QuizProgress[]> {
    const searchUrl = `${environment.url}/playing/users/${userId}/progress`;

    return this.http.get<QuizProgress[]>(searchUrl).pipe(
      catchError((error) => {
        console.error('Error while searching for progress:', error);
        return of(null);
      })
    );
  }
}
