import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.baseApiUrl;

  constructor(private _http: HttpClient) 
  { }

  getDashboardDetails() {
    return this._http.get<any[]>(this.baseUrl + '/dashboard/details').pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }


}
