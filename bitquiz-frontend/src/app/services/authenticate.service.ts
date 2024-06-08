import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../common/user';
import { EMPTY, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private http: HttpClient) {}

  getUser(email: string): Observable<User> {
    const searchUrl = `${environment.url}/users/search/findByEmail?email=${email}`;
    return this.http.get<User>(searchUrl);
  }

  saveUser(user: User): Observable<any> {
    const saveUrl = `${environment.url}/users`;
    return this.http.post<User>(saveUrl, user);
  }
}
