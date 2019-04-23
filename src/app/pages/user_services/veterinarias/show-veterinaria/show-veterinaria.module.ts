import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShowVeterinariaPage } from './show-veterinaria.page';

const routes: Routes = [
  {
    path: '',
    component: ShowVeterinariaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShowVeterinariaPage]
})
export class ShowVeterinariaPageModule {}
