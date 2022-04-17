export interface VehicleDamage {
  idVehicleDamaged: number | null;
  codDamageModel: string;
  damageSections: SectionVehicle[];
  damageDescription: string;
  characterParticipation: string;
}

/**
 * Interfaces para cargar la lista de secciones de un modelo de vehículo
 * o
 * las secciones dañadas de un vehiculo (idVehicleDamage != null)
 */
export interface SectionVehicle {
  code: string;
  order: number;
  description: string;
  type: string;
  boolSeverityDamage: boolean;
  selected: boolean;
  damageLevel: number;
}

export interface SectionsVehicleResponse {
  idVehicleDamaged?: number;
  codDamageModel: string;
  damageSections: SectionVehicle[];
  damageDescription?: string;
  characterParticipation?: string;
}

/**
 * Interface usada para leer y mantener la lista de mapas de la imagen del vehículo
 */
export interface ParteVehiculo {
  codigo: string;
  descripcion: string;
  coords: string;
  nivelDanyos?: number;
}

export interface PartesVehiculoResponse {
  partesVehiculo: ParteVehiculo[];
}
