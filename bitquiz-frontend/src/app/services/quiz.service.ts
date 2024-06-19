import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
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

    return this.http.get<Quiz[]>(searchUrl).pipe(
      catchError((error) => {
        console.error('Error while getting quizes:', error);
        return of(null);
      })
    );
  }

  getQuizById(id: number): Observable<Quiz> {
    const quizById = `${environment.url}/quiz/${id}`;
    return this.http.get<Quiz>(quizById).pipe(
      catchError((error) => {
        console.error('Error while getting quiz by ID:', error);
        return of(null);
      })
    );
  }

  makeQuiz(quiz: MakeQuiz): Observable<any> {
    const makeQuizUrl = `${environment.url}/make-quiz/make`;
    return this.http.post<MakeQuiz>(makeQuizUrl, quiz).pipe(
      catchError((error) => {
        console.error('Error while making quiz:', error);
        return of(null);
      })
    );
  }
  editQuiz(quiz: Quiz): Observable<any> {
    const updateUrl = `${environment.url}/make-quiz/edit`;
    return this.http.post<Quiz>(updateUrl, quiz).pipe(
      catchError((error) => {
        console.error('Error while editing quiz:', error);
        return of(null);
      })
    );
  }
  getMadeQuizes(userId: number): Observable<Quiz[]> {
    const searchUrl = `${environment.url}/quiz/${userId}/quizzes`;
    return this.http.get<Quiz[]>(searchUrl).pipe(
      catchError((error) => {
        console.error('Error while getting made quizes:', error);
        return of(null);
      })
    );
  }
  getAdminOfQuiz(quizId: number): Observable<User> {
    const searchUrl = `${environment.url}/quiz/${quizId}/admin`;
    return this.http.get<User>(searchUrl).pipe(
      catchError((error) => {
        console.error('Error while getting admin of quiz:', error);
        return of(null);
      })
    );
  }

  deleteQUiz(quizId: number, userId: number): Observable<any> {
    const deleteUrl = `${environment.url}/quiz/${quizId}/user/${userId}/delete`;
    return this.http.delete<any>(deleteUrl).pipe(
      catchError((error) => {
        console.error('Error while deleting quiz:', error);
        return of(null);
      })
    );
  }
  likeQuiz(quizId: number): Observable<any> {
    const likeUrl = `${environment.url}/quiz/${quizId}/like`;
    return this.http.post<any>(likeUrl, null).pipe(
      catchError((error) => {
        console.error('Error while liking quiz:', error);
        return of(null);
      })
    );
  }

  filterQuizes(category: string, difficulty: string): Observable<Quiz[]> {
    let filterUrl = `${environment.url}/quiz/filtered`;

    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    if (difficulty) {
      params = params.set('difficulty', difficulty);
    }

    return this.http.get<Quiz[]>(filterUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error while filtering quiz:', error);
        return of(null);
      })
    );
  }
}
