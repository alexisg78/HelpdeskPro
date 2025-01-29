
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tickets } from '../interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getTickets():Observable<Tickets[]> {
    return this.http.get<Tickets[]>(`${this.baseUrl}/tickets`)
  }

  getTicketById(id: number): Observable<Tickets|undefined> {
    return this.http.get<Tickets>(`${this.baseUrl}/tickets/${id}`)
      .pipe(
        catchError( error => of( undefined ) )
       )
  }

  postTickets(tickets: Tickets[]): Observable<Tickets> {
    return this.http.post<Tickets>(`${this.baseUrl}/tickets/post`, tickets);
  }

  getSuggestions( query: string ): Observable<[]> {
    return this.http.get<[]>( `${this.baseUrl}/heroes?q=${ query }&_limit=6` );
  }
}
