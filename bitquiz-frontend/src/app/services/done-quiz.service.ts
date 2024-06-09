import { Injectable } from '@angular/core';
import { SaveDoneQuiz } from '../common/save-done-quiz';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { DoneQuiz } from '../common/done-quiz';

@Injectable({
  providedIn: 'root',
})
export class DoneQuizService {
  constructor(private http: HttpClient) {}

  saveQuiz(quiz: SaveDoneQuiz): Observable<any> {
    const makeUrl = `${environment.url}/done-quizes/make`;
    return this.http.post<SaveDoneQuiz>(makeUrl, quiz);
  }
  getDoneQuizes(userId: number): Observable<DoneQuiz[]> {
    const searchUrl = `${environment.url}/users/${userId}/doneQuiz`;

    return this.http
      .get<getDoneQuizes>(searchUrl)
      .pipe(map((res) => res._embedded.doneQuizzes));
  }

  getLeaderboardForQuiz(quizId: number): Observable<DoneQuiz[]> {
    const searchUrl = `${environment.url}/done-quizes/${quizId}/doneQuiz`;
    return this.http.get<DoneQuiz[]>(searchUrl);
  }
}
interface getDoneQuizes {
  _embedded: {
    doneQuizzes: DoneQuiz[];
  };
}
interface getLeaderboardForQuiz {
  _embedded: {
    doneQuizzes: DoneQuiz[];
  };
}
