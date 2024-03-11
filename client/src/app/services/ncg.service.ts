import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { handleError } from '../constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NcgService {
  constructor(private _http: HttpClient) {}

  getMasterData(): Observable<any> {
    return this._http.get(`${environment.serverUrl}/ncg/masterData`).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  addFiles(formData: FormData): Observable<any> {
    return this._http
      .post(`${environment.serverUrl}/ncg/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(handleError));
  }

  getInternalUsers(): Observable<any> {
    return this._http.get(`${environment.serverUrl}/ncg/internalUsers`).pipe(
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
      .post(`${environment.serverUrl}/ncg/create`, data, {
        headers,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getAllNCs(): Observable<any> {
    return this._http.get(`${environment.serverUrl}/ncg/list`).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  getNC(id: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/ncg/get/${id}`).pipe(
      map((res) => {
        return res;
      }),
      retry(2),
      catchError(handleError)
    );
  }

  saveNC(data: any, id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    data.id = id;
    return this._http
      .patch(`${environment.serverUrl}/ncg`, data, {
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

  backNC(data: any, id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    data.id = id;
    return this._http
      .put(`${environment.serverUrl}/ncg/reject`, data, {
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

  acceptNC(data: any, id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    data.id = id;
    return this._http
      .put(`${environment.serverUrl}/ncg/accept`, data, {
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

  solveNC(data: any, id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    data.id = id;
    return this._http
      .put(`${environment.serverUrl}/ncg/solve`, data, {
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

  closeNC(data: any, id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    data.id = id;
    return this._http
      .put(`${environment.serverUrl}/ncg/close`, data, {
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

  cloneNC(id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .post(
        `${environment.serverUrl}/ncg/clone`,
        { id: id },
        {
          headers: headers,
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

  deleteNC(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .delete(`${environment.serverUrl}/ncg/${id}`, {
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

  cancelNC(id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .patch(
        `${environment.serverUrl}/ncg/cancel`,
        { id: id },
        {
          headers: headers,
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

  getMyNCs(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._http
      .get(`${environment.serverUrl}/ncg/myNCs`, {
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
      .get(`${environment.serverUrl}/ncg/getNameBySSO/${sso}`)
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
      .get(`${environment.serverUrl}/ncg/exportExcel/myNC`, {
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

  getCountOfEachDetectionPhase(): Observable<any> {
    return this._http
      .get(`${environment.serverUrl}/ncg/count/detectionPhase`)
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getCountOfProductType(): Observable<any> {
    return this._http
      .get(`${environment.serverUrl}/ncg/count/productType`)
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  getCountOfSymptomCodeL0(): Observable<any> {
    return this._http
      .get(`${environment.serverUrl}/ncg/count/symptomCodeL0`)
      .pipe(
        map((res) => {
          return res;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
