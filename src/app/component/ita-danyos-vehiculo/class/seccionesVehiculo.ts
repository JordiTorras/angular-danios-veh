export interface Seccion {
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
  secciones: Seccion[];
}

export interface DanyosVehiculo {
  codModeloDanyos: string | null;
  seccionesDanyadas: Seccion[];
  codCaracterParticipacion: string | null;
  descripcionLibre: string | null;
}
