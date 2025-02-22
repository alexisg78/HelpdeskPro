import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components'
import { TicketsService } from '../../services/tickets-service.service';
import { HelpDesk, Seguimiento } from '../../interfaces/ticket.interface';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'shared-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent  implements OnInit {

  @Input()
  public ticketRecibido!: HelpDesk | null;
  public seguimiento_enviar!: Seguimiento
  public textoSeguimiento: string= ''
  public idParams: string | null = ''
  public idTicket!: number

  constructor(private route: ActivatedRoute, private ticketService: TicketsService, private modalController: ModalController ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idParams = params.get('id')
      this.idTicket= Number(this.idParams);

      this.ticketService.getSeguimiento(this.idTicket)
        .subscribe(
          seg => {
              if (seg && seg.seguimiento) {
                //console.log('El seguimiento es: ', seg.seguimiento);
                this.textoSeguimiento = seg.seguimiento.trim();
                this.message = this.textoSeguimiento;  // Asegurar que message también se actualiza
              } else {
                this.textoSeguimiento = 'No hay seguimiento disponible';
              }
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
      let enviarSeg: string = ''
      if (event.detail.data){
        enviarSeg= event.detail.data;
        this.message = `${this.textoSeguimiento}  ${event.detail.data}`;
        this.addSeguimiento(enviarSeg);
      }
    }
  }

  addSeguimiento(seg: string) {
    if (!seg || !this.idTicket) return;

      this.seguimiento_enviar = { codigoppal: this.idTicket, seguimiento: seg };

      this.ticketService.postSeguimiento(this.seguimiento_enviar)
        .pipe(
          switchMap(() => this.ticketService.getSeguimiento(this.idTicket)),
          tap(seg => {
            this.textoSeguimiento = seg?.seguimiento?.trim() || 'No hay seguimiento disponible';
            this.message = this.textoSeguimiento;
          }),
          catchError(err => {
            console.error('Error al agregar seguimiento:', err);
            return of(null);
          })
        )
        .subscribe();
    }

}
