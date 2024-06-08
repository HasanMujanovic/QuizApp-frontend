import { Injectable } from '@angular/core';
import { QuizQuestion } from '../common/quiz-question';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QuizResponse } from '../common/quiz-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizPlayingService {
  constructor(private http: HttpClient) {}

  getQuestions(id: number): Observable<QuizQuestion[]> {
    const questionUrl = `${environment.url}/quizes/${id}/questions`;

    return this.http
      .get<getQuestions>(questionUrl)
      .pipe(map((res) => res._embedded.quizQuestionses));
  }
  getResponses(id: number) {
    const responseUrl = `${environment.url}/quiz-questions/${id}/responses`;

    return this.http
      .get<getResponses>(responseUrl)
      .pipe(map((res) => res._embedded.quizResponses));
  }
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
