import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( (m)=> m.AuthModule )
  },
  {
    path: 'home',
    loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path:'', redirectTo: 'auth', pathMatch: 'full'}, // Redirige solo si no hay ninguna ruta.
  { path: '**', redirectTo: 'auth', pathMatch: 'full' }  // Redirige a 'home' para rutas inválidas.
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
