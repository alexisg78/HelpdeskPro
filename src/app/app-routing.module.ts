import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( (m)=> m.AuthModule )
  },
  {
    path: 'helpdesk',
    loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule),
    canActivate: [AuthGuard]
  },
  { path:'', redirectTo: 'auth', pathMatch: 'full'}, // Redirige solo si no hay ninguna ruta.
  { path: '**', redirectTo: 'helpdesk', pathMatch: 'full' }  // Redirige a 'home' para rutas inválidas.
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
