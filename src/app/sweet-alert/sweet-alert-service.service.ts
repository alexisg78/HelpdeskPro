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

  toast_alerta_exito(msj: string, tiempo: number){
    this.Toast.fire({
        icon: "success",
        title: msj,
        timer: tiempo | 2000,
      }
    )
  }

  toast_alerta_error(msj: string, tiempo: number){
    this.Toast.fire({
        icon: "error",
        title: msj,
        timer: tiempo | 2000,
      }
    )
      return false;
  }

  toast_alerta_validaDatos(msj: string, tiempo:number){
    this.Toast.fire({
        icon: "warning",
        title: msj,
        timer: tiempo | 2000,
      }
    )
  }

}

