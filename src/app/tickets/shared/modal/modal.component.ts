import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components'

@Component({
  selector: 'shared-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @ViewChild(IonModal) modal!: IonModal;

  message = 'Agregar seguimiento al ticket';
  seguimiento: string= '';

    cancel() {
      this.modal.dismiss(null, 'cancel');
    }

    confirm() {
      this.modal.dismiss(this.seguimiento, 'confirm');
    }

    onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
      if (event.detail.role === 'confirm') {
        console.log(`Mensaje, ${event.detail.data}!`)
        this.message = `${this.seguimiento}!`;
      }
    }


}
