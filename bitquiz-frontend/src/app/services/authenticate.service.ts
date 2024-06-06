import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../common/user';
import { EMPTY, Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  baseUrl = 'http://localhost:8080/bit';
  constructor(private http: HttpClient) {}

  getUser(email: string): Observable<User> {
    const searchUrl = `${this.baseUrl}/users/search/findByEmail?email=${email}`;
    return this.http.get<User>(searchUrl);
  }

  saveUser(user: User): Observable<any> {
    const saveUrl = `${this.baseUrl}/users`;
    return this.http.post<User>(saveUrl, user);
  }
}
