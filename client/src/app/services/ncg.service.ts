import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { handleError } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class NcgService {
  constructor(private _http: HttpClient) {}

  getMasterData(): Observable<any> {
    return this._http.get(`${process.env['SERVER_URL']}/ncg/masterData`).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  addFiles(formData: FormData): Observable<any> {
    return this._http
      .post(`${process.env['SERVER_URL']}/ncg/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(handleError));
  }

  getInternalUsers(): Observable<any> {
    return this._http
      .get(`${process.env['SERVER_URL']}/ncg/internalUsers`)
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  createNC(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .post(`${process.env['SERVER_URL']}/ncg/create`, data, { headers })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getNC(id: string): Observable<any> {
    return this._http.get(`${process.env['SERVER_URL']}/ncg/get/${id}`).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  saveNC(data: any, id: string): Observable<any> {
    data.id = id;
    return this._http.patch(`${process.env['SERVER_URL']}/ncg`, data).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  backNC(data: any, id: string): Observable<any> {
    data.id = id;
    return this._http.put(`${process.env['SERVER_URL']}/ncg/back`, data).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  acceptNC(data: any, id: string): Observable<any> {
    data.id = id;
    return this._http.put(`${process.env['SERVER_URL']}/ncg`, data).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  cloneNC(id: any): Observable<any> {
    return this._http
      .post(`${process.env['SERVER_URL']}/ncg/clone`, { id: id })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  deleteNC(id: string): Observable<any> {
    return this._http.delete(`${process.env['SERVER_URL']}/ncg/${id}`).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  cancelNC(id: any): Observable<any> {
    return this._http
      .patch(`${process.env['SERVER_URL']}/ncg/cancel`, { id: id })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  closeNC(data: any, id: string): Observable<any> {
    data.id = id;
    return this._http.put(`${process.env['SERVER_URL']}/ncg/close`, data).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  getMyNCs(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .get(`${process.env['SERVER_URL']}/ncg/myNCs`, {
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

  getNameBySSO(sso: string): Observable<any> {
    return this._http
      .get(`${process.env['SERVER_URL']}/ncg/getNameBySSO/${sso}`)
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getFile(url: string): Observable<Blob> {
    return this._http.get(`${url}`, { responseType: 'blob' }).pipe(
      map((res: Blob) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  exportMyNCToExcel(): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .get(`${process.env['SERVER_URL']}/ncg/exportExcel/myNC`, {
        headers: headers,
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
