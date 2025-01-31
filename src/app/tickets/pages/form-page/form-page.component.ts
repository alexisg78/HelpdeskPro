import { Component,  Input, SimpleChanges } from '@angular/core';
import { HelpDesk } from '../../interfaces/ticket.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'form-page',
  templateUrl: './form-page.component.html',
  styles: ``,
  standalone: false
})
export class FormPageComponent {

  @Input()
  public ticketRecibido!: HelpDesk | null;

  constructor( private fb: FormBuilder  ){};

  public myForm: FormGroup = this.fb.group({
    fecha: ['', Validators.required],
    titulo: ['', [Validators.required, Validators.maxLength(50)]],
    textoreclamo: ['', [Validators.required, Validators.maxLength(200)]],
    nombreoperador: [''],
    area: ['', Validators.required],
    responsable: [''],
    userid_atiende: [''],
    empresa: ['', Validators.required],
    estado: ['', Validators.required],
    urgente: [false],
    // requerimiento: ['', Validators.maxLength(100)]
  });


  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticketRecibido'] && this.ticketRecibido) {
      console.log('Actualizando formulario con ticket recibido:', this.ticketRecibido);
      this.myForm.patchValue({
        fecha: this.ticketRecibido.fecha || '',
        titulo: this.ticketRecibido.titulo || '',
        textoreclamo: this.ticketRecibido.textoreclamo || '',
        nombreoperador: this.ticketRecibido.nombreoperador || '',
        area: this.ticketRecibido.area || '',
        responsable: this.ticketRecibido.responsable || '',
        userid_atiende: this.ticketRecibido.userid_atiende || '',
        empresa: this.ticketRecibido.empresa || '',
        estado: this.ticketRecibido.estado || '',
        urgente: this.ticketRecibido.urgente || false,
      });
    }
  }

  // Captura el valor del ion-searchbar y lo asigna al form
  onSearchbarChange(event: any, controlName: string): void {
    this.myForm.patchValue({ [controlName]: event.detail.value });
  }

  onSave():void {
    if (this.myForm.invalid) return
    console.log(this.myForm.value)
    // this.myForm.reset()
  }



  // getTicket() {
  //   console.log(`Ticket recibido desde el Form, enviado desde la list, ${this.ticketRecibido}`)
  // }

}
