import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TicketsModule } from '../tickets/tickets.module';
import { SharedModule } from '../tickets/shared/shared.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    TicketsModule,
    SharedModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
