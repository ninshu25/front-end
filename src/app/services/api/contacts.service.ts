import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from "rxjs";
import { Contact } from 'src/app/models/classes/contact.class';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private baseUrl = environment.baseApiUrl;

  constructor(private _http: HttpClient) 
  { }

  getContacts() {
    return this._http.get<Contact[]>(this.baseUrl + '/contacts').pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getContactsByPaging(currentPage: number, pageSize: number) {
    // Create HttpParams object to hold query parameters
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString());

    // Make the HTTP request with the query parameters
    return this._http.get<any>(this.baseUrl + '/contacts/pagination', { params }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getContactById(contactId: number) {
    return this._http.get<any>(this.baseUrl + '/contacts/' + contactId?.toString()).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updateContact(contact: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.put<any>(this.baseUrl + '/contacts/' + contact.id?.toString() + '/update', contact, { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  addContact(contact: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.post<any>(this.baseUrl + '/contacts/create', contact, { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  deleteContact(contact: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.delete<any>(this.baseUrl + '/contacts/' + contact.id?.toString() + '/delete', { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }


}
