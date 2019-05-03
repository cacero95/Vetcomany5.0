import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'grupos', loadChildren: './pages/grupos/grupos.module#GruposPageModule' },
  { path: 'pet-info', loadChildren: './pages/pet-info/pet-info.module#PetInfoPageModule' },
  { path: 'mascota', loadChildren: './pages/mascota/mascota.module#MascotaPageModule' },
  {
    path:'main', 
    loadChildren: './pages/main/main.module#MainPageModule'
  },
  {
    path:'calendar',
    loadChildren:'./pages/vet_services/calendar/calendar.module#CalendarPageModule'
  },
  {
    path:'user', // se puede ver toda la información de la cuenta
    loadChildren: './pages/user/user.module#UserPageModule'
  },
  {
    path:'users', // muestra los usuarios que tiene la veterinaria
    loadChildren:'./pages/vet_services/users/users.module#UsersPageModule'
  },
  {
    path:'veterinarias',
    loadChildren: './pages/user_services/veterinarias/veterinarias.module#VeterinariasPageModule'
  },
  {
    path:'notificaciones',
    loadChildren: './pages/user_services/notificaciones/notificaciones.module#NotificacionesPageModule'
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
