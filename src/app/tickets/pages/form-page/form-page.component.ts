import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Empresa, HelpDesk, Tickets } from '../../interfaces/ticket.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'form-page',
  templateUrl: './form-page.component.html',
  styles: ``,
  standalone: false
})
export class FormPageComponent implements OnInit {
  @Output()
  ticketSeleccionado = new EventEmitter<HelpDesk>()

  constructor( private fb: FormBuilder  ){}

  ngOnInit(): void {

  }

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
    requerimiento: ['', Validators.maxLength(100)]
  });


  // Captura el valor del ion-searchbar y lo asigna al form
  onSearchbarChange(event: any, controlName: string): void {
    this.myForm.patchValue({ [controlName]: event.detail.value });
  }

  onSave():void {
    if (this.myForm.invalid) return
    console.log(this.myForm.value)
    // this.myForm.reset()
  }

  getTicket(id: number) {

  }

}
