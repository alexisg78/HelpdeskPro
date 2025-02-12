import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

 private Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  toast_alerta (msj: string, tiempo:number, icon: 'success' | 'error' | 'warning' | 'info' | 'question'){
    this.Toast.fire({
        icon: icon,
        title: msj,
        timer: tiempo | 2000,
      }
    )
  }

}

