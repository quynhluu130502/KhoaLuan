import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry } from 'rxjs';
import { handleError } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class QsaService {
  constructor(private _http: HttpClient) {}
  getApplicationName(): Observable<any> {
    return this._http
      .get(`${import.meta.env['NG_APP_SERVER_URL']}/qsa/applicationName`)
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getApplicationRole(applicationName: string): Observable<any> {
    applicationName = applicationName.toLowerCase();
    return this._http
      .get(
        `${import.meta.env['NG_APP_SERVER_URL']}/qsa/${applicationName}/role`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getApplicationSubBusiness(applicationName: string): Observable<any> {
    applicationName = applicationName.toLowerCase();
    return this._http
      .get(
        `${
          import.meta.env['NG_APP_SERVER_URL']
        }/qsa/${applicationName}/sub-business`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getApplicationUnit(
    applicationName: string,
    subBusiness: string
  ): Observable<any> {
    applicationName = applicationName.toLowerCase();
    subBusiness = subBusiness.toLowerCase();
    return this._http
      .get(
        `${
          import.meta.env['NG_APP_SERVER_URL']
        }/qsa/${applicationName}/unit/${subBusiness}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  addApps(data: any): Observable<any> {
    console.log(data);
    return this._http
      .patch(`${import.meta.env['NG_APP_SERVER_URL']}/qsa/addApps`, data)
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
