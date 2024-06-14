import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { environment } from '../../environments/environment';
import { HtmlParser, identifierName } from '@angular/compiler';
import { Quiz } from '../Interface/quiz';
import { MakeQuiz } from '../Interface/make-quiz';
import { User } from '../Interface/user';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  quizInfo: Quiz;

  constructor(private http: HttpClient) {}

  getQuizes(): Observable<Quiz[]> {
    const searchUrl = `${environment.url}/quiz/getAll`;

    return this.http.get<Quiz[]>(searchUrl);
  }

  getQuizById(id: number): Observable<Quiz> {
    const quizById = `${environment.url}/quiz/${id}`;
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
    const searchUrl = `${environment.url}/quiz/${userId}/quizzes`;
    return this.http.get<Quiz[]>(searchUrl);
  }
  getAdminOfQuiz(quizId: number): Observable<User> {
    const searchUrl = `${environment.url}/quiz/${quizId}/admin`;
    return this.http.get<User>(searchUrl);
  }

  deleteQUiz(quizId: number, userId: number): Observable<any> {
    const deleteUrl = `${environment.url}/quiz/${quizId}/user/${userId}/delete`;
    return this.http.delete<any>(deleteUrl);
  }
  likeQuiz(quizId: number): Observable<any> {
    const likeUrl = `${environment.url}/quiz/${quizId}/like`;
    return this.http.post<any>(likeUrl, null);
  }
  filterQuizes(category: string, difficulty: string): Observable<Quiz[]> {
    const filterUrl = `${environment.url}/quiz/${category}/${difficulty}/filtered`;
    return this.http.get<Quiz[]>(filterUrl);
  }
}
