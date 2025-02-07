
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Area, Empresa, HelpDesk, Operador, Responsable } from '../interfaces/ticket.interface';
import { AuthService } from './../../auth/services/auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class TicketsService  {

  private baseUrl: string = environment.baseUrl;
  //private subUrl: string = 'HelpDesk?pageNumber=0'
  private token: string= ''

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token= this.authService.getToken()
  }

  getTickets(): Observable<HelpDesk[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    // ${this.subUrl}
    return this.http.get<HelpDesk[]>(`${this.baseUrl}/Gestion/Helpdesk`, { headers });
  }

  getTicketById(id: number): Observable<HelpDesk|undefined> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<HelpDesk>(`${this.baseUrl}/Gestion/getItemHelpDesk/${id}`, {headers})
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

    return this.http.get<Responsable[]>(`${this.baseUrl}/Gestion/GetResponsables`, { headers });
  }

  //Operadores
  getOperadores(codEmp: number): Observable<Operador[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<Operador[]>(`${this.baseUrl}/Gestion/GetOperadores/${codEmp}`, { headers });
  }

  getEmpresa(): Observable<Empresa[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<Empresa[]>(`${this.baseUrl}/Gestion/GetEmpresas`, { headers });
  }

  getArea(): Observable<Area[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.get<Area[]>(`${this.baseUrl}/Gestion/GetAreas`, { headers });
  }

  postTickets(helpdesk: any): Observable<HelpDesk> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,  // Agrega el token en el header
      'Content-Type': 'application/json'
    });

    return this.http.post<HelpDesk>(`${this.baseUrl}/Gestion/PostHelpDesk/`, helpdesk, { headers })
  }

}
