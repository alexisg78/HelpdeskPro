import { Component,  Input, SimpleChanges } from '@angular/core';
import { HelpDesk } from '../../interfaces/ticket.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'form-page',
  templateUrl: './form-page.component.html',
  styles: `
      :host {
    display: block;
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 1rem;
  }`,
  standalone: false
})
export class FormPageComponent {

  @Input()
  public ticketRecibido!: HelpDesk | null;

  @Input()
  public botonVisible: boolean= false;

  constructor( private fb: FormBuilder, private location: NavController ){};

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
      this.botonVisible = true;
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

  goBack(){
    this.location.back()
  }

}
