import { Component } from '@angular/core';
import { Empresa, Tickets } from '../../interfaces/ticket.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'form-page',
  templateUrl: './form-page.component.html',
  styles: ``,
  standalone: false
})
export class FormPageComponent {
  tickets!: Tickets

  constructor( private fb: FormBuilder  ){}

  public myForm: FormGroup = this.fb.group({
    empresa: [Empresa, Validators.required ],
    area: ['', Validators.required],
    operador: [''],
    tipoRequerimiento:[''],
    menu:[''],
    titulo:[''],
    requerimiento:['', Validators.maxLength(100)]
  })

  // Captura el valor del ion-searchbar y lo asigna al form
  onSearchbarChange(event: any, controlName: string): void {
    this.myForm.patchValue({ [controlName]: event.detail.value });
  }

  onSave():void {
    if (this.myForm.invalid) return
    console.log(this.myForm.value)
    this.myForm.reset()
  }

}
