export interface Tickets {
  fecha: string;
  titulo: string;
  textoreclamo: string;
  nombreoperador: string;
  codigoarea: number;
  nombre: string;
  fecharequerida: string;
  estado: string;
  color: number;
  codigoppal: number;
  codigoestado: number;
}


export interface HelpDesk {
  fecha: string;
  titulo: string;
  textoreclamo: string;
  nombreoperador: string;
  area: string;
  responsable: string;
  userid_atiende: string;
  empresa: string;
  codigoppal: number;
  codigoestado: number;
  estado: string;
  color: number;
  urgente: boolean;
  codigoempresa: number;
}

export enum Empresa {
  Aliare = "ALIARE",
  He = "HE",
}

export enum Area {
  Tecnica = "Técnica",
  Sistemas = "Sistemas",
}
