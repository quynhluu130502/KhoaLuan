import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { User } from '../models/user.model';
import { handleError } from '../constant';
import { environment } from 'src/environments/environment';

interface successfulLogin {
  user: User;
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  userType: string = '';
  currentUser: User = new User();

  login(userInfor: object): Observable<successfulLogin> {
    return this._http
      .post<successfulLogin>(`${environment.serverUrl}/user/login`, userInfor, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return res.body as successfulLogin;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getProtected(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .get(`${environment.serverUrl}/user/protected`, {
        headers: headers,
        withCredentials: true,
      })
      .pipe(
        map((res: any) => {
          if (res && res.result) {
            this.userType = res.result.role;
            this.currentUser = res.result;
          }
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getRefreshToken(): Observable<any> {
    return this._http
      .post(
        `${environment.serverUrl}/user/refreshToken`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  logout(): Observable<any> {
    return this._http
      .post(`${environment.serverUrl}/user/logout`, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          this.userType = '';
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
