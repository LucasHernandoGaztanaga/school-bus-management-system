export interface Chofer {
  _id?: string;
  dni: string;
  nombre: string;
  apellido: string;
  licencia: string;
  microId?: string | null;
  microInfo?: {
    patente: string;
    modelo: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChoferRequest {
  dni: string;
  nombre: string;
  apellido: string;
  licencia: string;
}

export interface UpdateChoferRequest {
  nombre?: string;
  apellido?: string;
  licencia?: string;
}