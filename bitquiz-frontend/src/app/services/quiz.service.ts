import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from '../common/quiz';
import { Observable, map } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { MakeQuiz } from '../common/make-quiz';
import { environment } from '../../environments/environment';
import { identifierName } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  searchUrl = environment.url + '/quizes';
  quizInfo: Quiz;

  constructor(private http: HttpClient) {}

  getQuizes(): Observable<Quiz[]> {
    return this.http
      .get<getQuiz>(this.searchUrl)
      .pipe(map((res) => res._embedded.quizzes));
  }

  getOneQuiz(id: number): Observable<Quiz> {
    const quizById = this.searchUrl + `/${id}`;
    return this.http.get<Quiz>(quizById);
  }

  makeQuiz(quiz: MakeQuiz): Observable<any> {
    const makeQuizUrl = `${environment.url}/make-quiz/make`;
    return this.http.post<MakeQuiz>(makeQuizUrl, quiz);
  }
  editQuiz(quiz: Quiz): Observable<any> {
    const updateUrl = `${environment.url}/make-quiz/edit`;
    return this.http.post<Quiz>(updateUrl, quiz);
  }
  getMadeQuizes(userId: number): Observable<Quiz[]> {
    const searchUrl = `${environment.url}/users/${userId}/quizzes`;
    return this.http
      .get<getQuiz>(searchUrl)
      .pipe(map((res) => res._embedded.quizzes));
  }
}
interface getQuiz {
  _embedded: {
    quizzes: Quiz[];
  };
}