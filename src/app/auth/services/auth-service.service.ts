import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private subUrl: string = 'Auth/Login';

  constructor(private http: HttpClient) { }

  postLogin(credencialesAuth: { username: string, password: string }): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json-patch+json' });

    return this.http.post<LoginResponse>(`${this.baseUrl}/${this.subUrl}/`, credencialesAuth, { headers })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
