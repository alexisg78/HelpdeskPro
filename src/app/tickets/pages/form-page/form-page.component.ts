import { Component } from '@angular/core';
import { TicketsService } from '../../services/tickets-service.service';
import { Tickets } from '../../interfaces/ticket.interface';

@Component({
  selector: 'form-page',
  templateUrl: './form-page.component.html',
  styles: ``,
  standalone: false
})
export class FormPageComponent {
  tickets: Tickets[] = []
  constructor  (private ticketsService : TicketsService) {}

}
