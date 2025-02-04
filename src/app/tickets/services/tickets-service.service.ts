
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Area, Empresa, HelpDesk, Operador, Responsable } from '../interfaces/ticket.interface';


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

  // Responsables
  getResponsables(): Observable<Responsable[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<Responsable[]>(`${this.baseUrl}/GetResponsables/`, { headers });
  }

  //Operadores
  getOperadores(codEmp: number): Observable<Operador[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<Operador[]>(`${this.baseUrl}/GetOperadores/${codEmp}`, { headers });
  }

  getEmpresa(): Observable<Empresa[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<Empresa[]>(`${this.baseUrl}/GetEmpresas/`, { headers });
  }

  getArea(): Observable<Area[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<Area[]>(`${this.baseUrl}/GetAreas/`, { headers });
  }

  postTickets(helpdesk: HelpDesk[]): Observable<HelpDesk> {
    return this.http.post<HelpDesk>(`${this.baseUrl}/HelpDesk/`, helpdesk);
  }

  getSuggestions( query: string ): Observable<[]> {
    return this.http.get<[]>( `${this.baseUrl}/heroes?q=${ query }&_limit=6` );
  }
}
