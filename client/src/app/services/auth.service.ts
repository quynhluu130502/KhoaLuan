import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { User } from '../models/user.model';
import { handleError } from '../constant';

interface successfulLogin {
  user: User;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn:boolean = false;
  constructor(private _http: HttpClient) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  login(userInfor: object): Observable<successfulLogin> {
    return this._http
      .post<successfulLogin>(
        `${process.env['SERVER_URL']}/user/login`,
        userInfor
      )
      .pipe(
        map((res) => {
          return res as successfulLogin;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  isAuthenticated(){
    return this.isLoggedIn;
  }
  changeAuthStatus(){
    this.isLoggedIn = !this.isLoggedIn;
  }
}
