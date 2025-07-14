export interface Micro {
  _id?: string;
  patente: string;
  modelo: string;
  capacidad: number;
  choferId?: string | null;
  choferInfo?: {
    dni: string;
    nombre: string;
    apellido: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMicroRequest {
  patente: string;
  modelo: string;
  capacidad: number;
}

export interface UpdateMicroRequest {
  modelo?: string;
  capacidad?: number;
}

export interface AssignChoferRequest {
  choferDni: string;
}