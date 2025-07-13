export interface CreateChoferDto {
  dni: string;
  nombre: string;
  apellido: string;
  licencia: string;
}

export interface UpdateChoferDto {
  nombre?: string;
  apellido?: string;
  licencia?: string;
}