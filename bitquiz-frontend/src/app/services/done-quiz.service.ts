import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { SaveDoneQuiz } from '../Interface/save-done-quiz';
import { DoneQuiz } from '../Interface/done-quiz';

@Injectable({
  providedIn: 'root',
})
export class DoneQuizService {
  constructor(private http: HttpClient) {}

  saveQuiz(quiz: SaveDoneQuiz): Observable<any> {
    const makeUrl = `${environment.url}/done-quizes/make`;
    return this.http.post<SaveDoneQuiz>(makeUrl, quiz).pipe(
      catchError((error) => {
        console.error('Error while saving quiz:', error);
        return of(null);
      })
    );
  }

  getDoneQuizes(userId: number): Observable<DoneQuiz[]> {
    const searchUrl = `${environment.url}/done-quizes/user/${userId}`;
    return this.http.get<DoneQuiz[]>(searchUrl).pipe(
      catchError((error) => {
        console.error('Error while getting done quiz:', error);
        return of(null);
      })
    );
  }

  getLeaderboardForQuiz(quizId: number): Observable<DoneQuiz[]> {
    const searchUrl = `${environment.url}/done-quizes/${quizId}/doneQuiz`;
    return this.http.get<DoneQuiz[]>(searchUrl).pipe(
      catchError((error) => {
        console.error('Error while getting leaderboard:', error);
        return of(null);
      })
    );
  }
}
