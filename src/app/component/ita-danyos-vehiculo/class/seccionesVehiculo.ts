export interface SeccionVehiculo {
  codigo: string;
  orden: number;
  descripcion: string;
  classificacion: string;
  boolGravedadDanyo: boolean;
  seleccionado: boolean;
  nivelDanyos: number | null;
}

export interface SeccionesVehiculoResponse {
  codigoListaSecciones: string;
  secciones: SeccionVehiculo[];
}

export interface DanyosVehiculo {
  codModeloDanyos: string;
  lstSeccionesDanyadas: SeccionVehiculo[];
  codCaracterParticipacion: string | null;
  desDanyosLibre: string | null;
}
