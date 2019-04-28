import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TwitterSharedPage } from './twitter-shared.page';

const routes: Routes = [
  {
    path: '',
    component: TwitterSharedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TwitterSharedPage]
})
export class TwitterSharedPageModule {}
