import { Component, OnInit } from '@angular/core';
import { HelpDesk } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css',
  standalone: false
})
export class ListPageComponent implements OnInit{

  public tickets: HelpDesk[] = []
  public ticketSeleccionado!: HelpDesk | null
  public selectedTicket: any = null;

  constructor  (private ticketsService : TicketsService, private router: Router) {}

  ngOnInit(): void {
    this.getActualiza()
  }

  selectRow(item: any) {
    this.selectedTicket = item;
    this.ticketSeleccionado= item;
  }

  getTicket(item:HelpDesk, id: number){
    let pos: number;
    this.router.navigate([`helpdesk/details`, id]);
    pos = this.tickets.findIndex(ticket => ticket.codigoppal === id);
    this.selectRow(item)
  }

  getActualiza(){
    this.ticketsService.getTickets().pipe(take(1))
    .subscribe( tickets => {
      this.tickets =  tickets
      this.selectedTicket= this.tickets[0]
    });
  }

}
