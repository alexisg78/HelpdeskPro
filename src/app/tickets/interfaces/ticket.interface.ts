export interface HelpDesk {
  fecha: string;
  titulo: string;
  textoreclamo: string;
  nombreoperador: string;
  area: string;
  responsable: string;
  userid_atiende: string;
  empresa: Empresa;
  codigoppal: number;
  codigoestado: number;
  estado: string;
  color: number;
  urgente: boolean;
  codigoempresa: number;
}

// export enum Empresa {
//   Aliare = "ALIARE",
//   He = "HE",
// }

export interface Area {
  codigo: number
  descripcion: string
}

export interface Empresa {
  codigo: number
  descripcion: string
}

export interface TipoReclamo {
    codigo: number
    descripcion: string
}

export interface Menu {
  codigo: number
  descripcion: string
}

export interface Sector {
  codigo: number
  descripcion: string
}

export interface Responsable {
  codigo: number
  descripcion: string
}

export interface Operador {
  codigo: number
  descripcion: string
}

export interface Estado {
  codigo: number
  descripcion: string
}
