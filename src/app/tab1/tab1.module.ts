import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';


import { Tab1PageRoutingModule } from './tab1-routing.module';
import { TicketsModule } from '../tickets/tickets.module';
import { SharedModule } from '../tickets/shared/shared.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    TicketsModule,
    SharedModule
],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
