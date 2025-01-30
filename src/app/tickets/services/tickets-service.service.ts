
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HelpDesk } from '../interfaces/ticket.interface';
//import { Tickets } from '../interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private baseUrl: string = environment.baseUrl;
  private subUrl: string = 'HelpDesk?pageNumber=0'
  private token : string = environment.token

  constructor(private http: HttpClient) { }

  getTickets(): Observable<HelpDesk[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<HelpDesk[]>(`${this.baseUrl}/${this.subUrl}`, { headers });
  }

  getTicketById(id: number): Observable<HelpDesk|undefined> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<HelpDesk>(`${this.baseUrl}/getItemHelpDesk/${id}`, {headers})
      .pipe(
        catchError( error => of( undefined ) )
       )
  }

  postTickets(helpdesk: HelpDesk[]): Observable<HelpDesk> {
    return this.http.post<HelpDesk>(`${this.baseUrl}/HelpDesk/`, helpdesk);
  }

  // getSuggestions( query: string ): Observable<[]> {
  //   return this.http.get<[]>( `${this.baseUrl}/heroes?q=${ query }&_limit=6` );
  // }
}
