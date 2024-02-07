import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { User } from '../models/user.model';
import { handleError } from '../constant';

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

  login(userInfor: object): Observable<successfulLogin> {
    return this._http
      .post<successfulLogin>(
        `${process.env['SERVER_URL']}/user/login`,
        userInfor,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((res) => {
          return res as successfulLogin;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getProtected(): any {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .get(`${process.env['SERVER_URL']}/user/protected`, {
        headers: headers,
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getRefreshToken(): any {
    return this._http
      .post(`${process.env['SERVER_URL']}/user/refreshToken`, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  logout(): any {
    return this._http
      .post(`${process.env['SERVER_URL']}/user/logout`, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
