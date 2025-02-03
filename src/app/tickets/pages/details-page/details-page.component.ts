import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpDesk } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';


@Component({
  selector: 'details-page',
  templateUrl: './details-page.component.html',
  styles: ``,
  standalone: false
})
export class DetailsPageComponent implements OnInit{
  public idParams: string | null = ''
  public idTicket: number = 0;
  public ticket!: HelpDesk | null
  public botonVolverVisible: boolean = false;

  constructor(private route: ActivatedRoute, private ticketService: TicketsService ) {}

  ngOnInit() {
    //console.log('ID inicializado:', this.idParams);
    this.route.paramMap.subscribe(params => {
    this.idParams = params.get('id')
    //console.log('ID actualizado:', this.idParams);
    this.obtenerTicket()
    })
  }

  obtenerTicket():void {
    this.idTicket= Number(this.idParams);
    this.ticketService.getTicketById(this.idTicket)
      .subscribe(
        ticket => {
          if (!ticket) return;
          this.ticket = ticket
          //console.log('Ticket Recibido', this.ticket)
        });
  }

}

