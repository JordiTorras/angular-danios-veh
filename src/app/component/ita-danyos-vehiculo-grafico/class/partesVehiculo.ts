export interface ParteVehiculo {
  codigo: string;
  descripcion: string;
  coords: string;
}

export interface PartesVehiculoResponse {
  partesVehiculo: ParteVehiculo[];
}
