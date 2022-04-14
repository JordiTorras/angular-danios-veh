export interface Seccion {
  codigo: string;
  orden: number;
  descripcion: string;
  classificacion: string;
  boolGravedadDanyo: boolean;
  seleccionado: boolean;
  nivelDanyos: number;
}

export interface SeccionesVehiculoResponse {
  codigoListaSecciones: string;
  secciones: Seccion[];
}

export interface SeccionesVehiculo {
  codigoListaSecciones: string;
  secciones: Seccion[];
}
