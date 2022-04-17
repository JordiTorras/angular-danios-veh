export interface SeccionesVehiculoResponse {
  codigoModeloVehiculo: string;
  secciones: SeccionVehiculo[];
}

export interface SeccionVehiculo {
  codigo: string;
  orden: number;
  descripcion: string;
  classificacion: string;
  boolGravedadDanyo: boolean;
  seleccionado: boolean;
  nivelDanyos: number | 0;
}

export interface DanyosVehiculo {
  codModeloDanyos: string;
  lstSeccionesDanyadas: SeccionVehiculo[];
  codCaracterParticipacion: string | null;
  desDanyosLibre: string | null;
}

export interface ParteVehiculo {
  codigo: string;
  descripcion: string;
  coords: string;
  nivelDanyos?: number;
}

export interface PartesVehiculoResponse {
  partesVehiculo: ParteVehiculo[];
}
