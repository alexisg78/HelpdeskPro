import { Component,  OnInit } from '@angular/core';
import { HelpDesk } from '../../interfaces/ticket.interface';
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
  public selectedTicket: any = null;

  constructor  (private ticketsService : TicketsService, private router: Router) {}

  selectRow(item: any) {
    this.selectedTicket = item;
  }

  ngOnInit(): void {
    this.ticketsService.getTickets()
       .subscribe( tickets => this.tickets =  tickets);
       console.log(this.tickets)
  }

  getTicket(id: number){
    this.router.navigate([`home/details`, id]);
    console.log(this.ticketSeleccionado?.codigoppal)
  }

}
