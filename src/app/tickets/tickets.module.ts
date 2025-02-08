import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SweetAlertModule } from '../sweet-alert/sweet-alert.module';
import { TicketsRoutingModule } from './tickets-routing.module';

import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    DetailsPageComponent,
    FormPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    IonicModule,
    TicketsRoutingModule,
    SharedModule,
    SweetAlertModule,
  ],
  exports:[
    DetailsPageComponent,
    FormPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    HomeComponent
  ]
})
export class TicketsModule { }
