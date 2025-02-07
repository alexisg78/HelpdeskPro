export interface HelpDesk {
  fecha: string;
  titulo: string;
  textoreclamo: string;
  nombreoperador: string;
  area: Area;
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

export interface CrearHelpDesk {
  area:Area;
  empresa: Empresa;
  titulo: string;
  codigooperador_solicita: number;
  codigosistema?: number;
  codigotiporeclamo?: number;
  codigomenu?: number;
  codigoestado?: number;
  codigoresponsable: number;
  tipoticket?: number;
  helpdesk?: boolean;
  textoreclamo: string
}

export interface CredencialesAuth {
  username: string;
  password: string;
  token?: string;
}


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
