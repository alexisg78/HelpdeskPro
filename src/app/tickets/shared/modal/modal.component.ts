import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components'
import { TicketsService } from '../../services/tickets-service.service';
import { HelpDesk, Seguimiento } from '../../interfaces/ticket.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shared-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent  implements OnInit {

  @Input()
  public ticketRecibido!: HelpDesk | null;
  public seguimientoRecibido?: Seguimiento
  public textoSeguimiento: string= ''
  public idParams: string | null = ''
  public idTicket?: number

  constructor(private route: ActivatedRoute, private ticketService: TicketsService ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idParams = params.get('id')
      this.idTicket= Number(this.idParams);
      console.log('ID Ticket desde la ruta: ', this.idTicket)

      this.ticketService.getSeguimiento(this.idTicket)
        .subscribe(
          seg => {
              console.log('el seguimiento es: ', seg.seguimiento)
              this.textoSeguimiento= seg.seguimiento.trim()
            }
        )
    })
  }

  @ViewChild(IonModal) modal!: IonModal;

  message = this.textoSeguimiento || 'Agregar seguimiento al ticket';
  seguimiento?: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.seguimiento, 'confirm');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {

      console.log(`Mensaje, ${event.detail.data}`)
      this.message = `${this.textoSeguimiento}  ${event.detail.data}`;
    }
  }


}
