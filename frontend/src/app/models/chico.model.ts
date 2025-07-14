export interface Chico {
  _id?: string;
  dni: string;
  nombre: string;
  apellido: string;
  edad: number;
  microId?: string | null;
  microInfo?: {
    patente: string;
    modelo: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChicoRequest {
  dni: string;
  nombre: string;
  apellido: string;
  edad: number;
}

export interface UpdateChicoRequest {
  nombre?: string;
  apellido?: string;
  edad?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}