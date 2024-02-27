import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from "rxjs";
import { PropertyOwnership } from 'src/app/models/classes/property-ownership.class';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyOwnershipService {

  private baseUrl = environment.baseApiUrl;

  constructor(private _http: HttpClient) 
  { }

  getPropertiyOwnerships() {
    return this._http.get<any[]>(this.baseUrl + '/property-ownerships').pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPropertiyOwnershipById(propertyId: string) {
    return this._http.get<any>(this.baseUrl + '/property-ownerships/' + propertyId).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPropertyOwnershipsByContactId(contactId: string) {
    return this._http.get<any>(this.baseUrl + '/property-ownerships/contact/' + contactId).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPropertyOwnershipsByPropertyId(propertyId: string) {
    return this._http.get<any>(this.baseUrl + '/property-ownerships/property/' + propertyId).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updatePropertyOwnership(property: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.put<any>(this.baseUrl + '/property-ownerships/' + property.id?.toString(), { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  addPropertyOwnership(propertyOwnership: PropertyOwnership) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.post<any>(this.baseUrl + '/property-ownerships/create', propertyOwnership, { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  deletePropertyOwnership(propertyOwnership: PropertyOwnership) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.delete<any>(this.baseUrl + '/property-ownerships/' + propertyOwnership.id + '/delete', { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }


}
