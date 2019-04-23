import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CentralPage } from './central.page';

const routes: Routes = [
  {
    path: '',
    component: CentralPage,
    children:[
      
      {
        path:'main', //main page usurio ya logeado
        loadChildren: '../main/main.module#MainPageModule'
      },
      {
        path:'grupos',
        loadChildren: '../grupos/grupos.module#GruposPageModule'
      },
      {
        path:'calendar',
        loadChildren:'../vet_services/calendar/calendar.module#CalendarPageModule'
      },
      {
        path:'user', // se puede ver toda la información de la cuenta
        loadChildren: '../user/user.module#UserPageModule'
      },
      {
        path:'users', // muestra los usuarios que tiene la veterinaria
        loadChildren:'../vet_services/users/users.module#UsersPageModule'
      },
      {
        path:'veterinarias',
        loadChildren: '../user_services/veterinarias/veterinarias.module#VeterinariasPageModule'
      },
      {
        path:'notificaciones',
        loadChildren: '../user_services/notificaciones/notificaciones.module#NotificacionesPageModule'
      }
      
    ]
  },
  {
    path: '',
    redirectTo:'/central/main'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CentralPage]
})
export class CentralPageModule {}
