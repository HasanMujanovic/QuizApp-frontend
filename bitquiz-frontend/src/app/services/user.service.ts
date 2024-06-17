import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../Interface/user';
import { UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private http: HttpClient) {}

  getUser(email: string): Observable<User> {
    const searchUrl = `${environment.url}/user/getByEmail/${email}`;
    return this.http.get<User>(searchUrl).pipe(
      catchError((error) => {
        console.error('Greška prilikom uzimanja usera:', error);
        return of(null);
      })
    );
  }

  getUserById(userId: number): Observable<User> {
    const searchUrl = `${environment.url}/user/getById/${userId}`;
    return this.http.get<User>(searchUrl).pipe(
      catchError((error) => {
        console.error('Greška prilikom uzimanja usera po idu:', error);
        return of(null);
      })
    );
  }

  editStatus(status: string, email: string): Observable<any> {
    const url = `${environment.url}/user/save-status/${status}/${email}`;
    return this.http.post<any>(url, null).pipe(
      catchError((error) => {
        console.error('Greška prilikom editovanja statusa:', error);
        return of(null);
      })
    );
  }

  getUserLeaderboard(): Observable<User[]> {
    const url = `${environment.url}/user/sorted`;
    return this.http.get<User[]>(url).pipe(
      catchError((error) => {
        console.error('Greška prilikom uzimanja leaderboarda:', error);
        return of(null);
      })
    );
  }

  register(userDTO: User, password: string): Observable<any> {
    const url = `${environment.url}/user/register`;

    return this.http.post<any>(url, { userDTO, password });
  }

  login(email: string, password: string): Observable<User> {
    const url = `${environment.url}/user/login`;

    return this.http.post<User>(url, { email, password });
  }
}
