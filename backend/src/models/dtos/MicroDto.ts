export interface CreateMicroDto {
  patente: string;
  modelo: string;
  capacidad: number;
}

export interface UpdateMicroDto {
  modelo?: string;
  capacidad?: number;
}

export interface AssignChoferToMicroDto {
  choferDni: string;
}