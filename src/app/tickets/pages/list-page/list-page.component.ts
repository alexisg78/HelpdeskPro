import { Component,  OnInit } from '@angular/core';
import { HelpDesk, Tickets } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css',
  standalone: false
})
export class ListPageComponent implements OnInit{

  public tickets: HelpDesk[] = []
  public ticketSeleccionado: HelpDesk | undefined
  constructor  (private ticketsService : TicketsService, private router: Router) {}

  ngOnInit(): void {
    this.ticketsService.getTickets()
       .subscribe( tickets => this.tickets =  tickets);
       console.log(this.tickets)
  }

  getTicket(id: number){
    this.ticketsService.getTicketById(id)
    .subscribe(
      ticket => {
        if (!ticket) return;
        this.ticketSeleccionado = ticket
        console.log(this.ticketSeleccionado)
        // this.getEnviaTicket(this.ticketSeleccionado.codigoppal)
      });
  }

  getEnviaTicket(codigoppal: number) {
    this.router.navigate(['/details/:id', codigoppal]);
    console.log(this.ticketSeleccionado?.codigoppal)
  }
}


