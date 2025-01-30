import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HelpDesk, Tickets } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css',
  standalone: false
})
export class ListPageComponent implements OnInit{

  public tickets: HelpDesk[] = []
  public ticketSeleccionado?: HelpDesk

  // @Output()
  // ticketSeleccionado = new EventEmitter<HelpDesk>()

  constructor  (private ticketsService : TicketsService) {}

  ngOnInit(): void {
    this.ticketsService.getTickets()
       .subscribe( tickets => this.tickets =  tickets);
       console.log(this.tickets)
  }

  getTicket(id: number){
    this.ticketsService.getTicketById(id)
    .subscribe(
      ticket => {
        //this.ticketSeleccionado.emit(ticket);
        this.ticketSeleccionado= ticket
        console.log(this.ticketSeleccionado)
      });
  }

}


// getTicket(codigoppal: number) {
//   this.router.navigate(['/detalle-ticket', codigoppal]);
// }
