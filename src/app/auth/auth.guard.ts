// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    //Verifica si el usuario está autenticado
    // if (this.authService.getToken()) {
    //   return true; // Permite la navegación
    // } else {
    //   this.router.navigate(['/login']); // Redirige al login si no está autenticado
    //   return false; // No permite la navegación
    // }

    const isLoggedIn= this.authService.getToken()

    //Si el usuario intenta acceder a 'auth' y ya está logueado, redirige a 'helpdesk'

    if ( state.url.startsWith('/auth') && isLoggedIn ) {
      this.router.navigate(['/helpdesk']);
      return false;
    }

    // Si intenta acceder a 'helpdesk' y no está autenticado, redirige a 'auth'
    if ( state.url.startsWith('/helpdesk') && !isLoggedIn ) {
      this.router.navigate(['/auth']);
      return false;
    }

    if ( !isLoggedIn ){
      return false;
    }

    return true;
  }
}
