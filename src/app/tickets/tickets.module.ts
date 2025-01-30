import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { TicketsRoutingModule } from './tickets-routing.module';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';

@NgModule({
  declarations: [
    DetailsPageComponent,
    FormPageComponent,
    LayoutPageComponent,
    ListPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TicketsRoutingModule,
  ],
  exports:[
    DetailsPageComponent,
    FormPageComponent,
    LayoutPageComponent,
    ListPageComponent
  ]
})
export class TicketsModule { }
