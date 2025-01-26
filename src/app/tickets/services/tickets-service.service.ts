import { HttpClient } from '@angular/common/http/index.js';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getTickets():Observable<[]> {
    return this.http.get<[]>(`${ this.baseUrl }/tickets`)
  }

  // getTicketById(id: string): Observable<Hero|undefined> {

  getTicketById(id: string): Observable<any|undefined> {
    return this.http.get<any>(`${this.baseUrl}/tickets/${id}`)
      .pipe(
        catchError( error => of( undefined ) )
       )
  }

  getSuggestions( query: string ): Observable<[]> {
    return this.http.get<[]>( `${this.baseUrl}/heroes?q=${ query }&_limit=6` );
  }
}
