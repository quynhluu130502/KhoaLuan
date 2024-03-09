import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry } from 'rxjs';
import { handleError } from '../constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QsaService {
  constructor(private _http: HttpClient) {}
  getApplicationName(): Observable<any> {
    return this._http.get(`${environment.serverUrl}/qsa/applicationName`).pipe(
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
      .get(`${environment.serverUrl}/qsa/${applicationName}/role`)
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
      .get(`${environment.serverUrl}/qsa/${applicationName}/sub-business`)
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
        `${environment.serverUrl}/qsa/${applicationName}/unit/${subBusiness}`
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
    return this._http.patch(`${environment.serverUrl}/qsa/addApps`, data).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  getInternalUsers(): Observable<any> {
    return this._http.get(`${environment.serverUrl}/qsa/internalUsers`).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  isInternalUser(sso: string): Observable<any> {
    return this._http
      .post(`${environment.serverUrl}/qsa/isInternalUser`, { sso })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  removerInternalUser(sso: string): Observable<any> {
    return this._http
      .patch(`${environment.serverUrl}/qsa/removeInternalUser`, { sso })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
