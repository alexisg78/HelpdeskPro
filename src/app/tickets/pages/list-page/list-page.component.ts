import { Component, OnInit } from '@angular/core';
import { Tickets } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css',
  standalone: false
})
export class ListPageComponent implements OnInit{

  public tickets: Tickets[] = []

  constructor  (private ticketsService : TicketsService) {}

  ngOnInit(): void {
    this.ticketsService.getTickets()
       .subscribe( tickets => this.tickets =  tickets);
  }



}
