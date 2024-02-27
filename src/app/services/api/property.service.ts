import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private baseUrl = environment.baseApiUrl;

  constructor(private _http: HttpClient) 
  { }

  getProperties() {
    return this._http.get<any[]>(this.baseUrl + '/properties').pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPropertiesByPaging(currentPage: number, pageSize: number) {
    // Create HttpParams object to hold query parameters
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString());

    // Make the HTTP request with the query parameters
    return this._http.get<any>(this.baseUrl + '/properties/pagination', { params }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }


  getPropertyById(propertyId: string) {
    return this._http.get<any>(this.baseUrl + '/properties/' + propertyId).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updateProperty(property: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.put<any>(this.baseUrl + '/properties/' + property.id?.toString() + '/update', property, { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  addProperty(property: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.post<any>(this.baseUrl + '/properties/create', property, { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  deleteProperty(property: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.delete<any>(this.baseUrl + '/properties/' + property.id?.toString() + '/delete', { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }


}
