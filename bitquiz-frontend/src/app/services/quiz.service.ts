import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from '../common/quiz';
import { Observable, map } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { MakeQuiz } from '../common/make-quiz';
import { environment } from '../../environments/environment';

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
}
interface getQuiz {
  _embedded: {
    quizzes: Quiz[];
  };
}
