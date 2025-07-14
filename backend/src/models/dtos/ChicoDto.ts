export interface CreateChicoDto {
  dni: string;
  nombre: string;
  apellido: string;
  edad: number;
}

export interface UpdateChicoDto {
  nombre?: string;
  apellido?: string;
  edad?: number;
}

export interface AssignChicoToMicroDto {
  microPatente: string;
}