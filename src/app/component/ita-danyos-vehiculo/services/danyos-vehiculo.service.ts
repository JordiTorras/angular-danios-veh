import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  ParteVehiculo,
  SectionsVehicleResponse,
} from '../class/seccionesVehiculo';
import { Observable } from 'rxjs';
import { detValorResponse } from '../class/detValores';

@Injectable({
  providedIn: 'root',
})
export class DanyosVehiculoService {
  constructor(private _http: HttpClient) {}

  getListaSecciones(tipoVehiculo: string): Observable<SectionsVehicleResponse> {
    /**
     * Recuperamos la lista de las secciones que componen el vehiculo en función de su tipologia
     * Tipo Vehiculo            Modelo Daños del Vehiculo
     * --------------           ----------------------------
     **  Auto               -->         AUTO
     **  Servicio Especial  -->         AUTO
     **  Servicio Publico   -->
     *   Jeeps hasta 4 Cilindros
     *   Trailer
     *   Pick Up Clase "A"
     *   Jeeps de mas de 4 Cilindros
     *   Pick Up Clase "B"
     **  Camion             -->         CAMION
     *   Semi-Remolque
     *   Acoplado
     *   Tractor Rural
     *   Maquina Rural
     *   Acoplado Rural
     *   Tractor(Excluido Rural)
     *   Casa Rodante
     *   Bantam
     *   Motocicleta
     *   Motoneta
     *   Bicicleta con Motor
     *   Chassis
     *   Implemento Trabajo Rural
     *   Semi-Traccion
     **   Otros              -->         AUTO
     *
     * TODO implementar el servicio
     */

    let modeloDanios: string = '';

    switch (tipoVehiculo) {
      case 'COCHE': {
        modeloDanios = 'AUTO';
        break;
      }
      case 'TAXI': {
        modeloDanios = 'AUTO';
        break;
      }
      case 'CAMION': {
        modeloDanios = 'CAMION';
        break;
      }
      default: {
        modeloDanios = 'AUTO';
        break;
      }
    }

    const httpUrl = 'assets/mockup/seccionesVehiculo_' + modeloDanios + '.json';
    const httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };

    return this._http.get<SectionsVehicleResponse>(httpUrl, httpOptions);
  }

  /**
   * Recuper la lista del Catalogo de Valores
   */
  getDetValores(codDvalor: string): Observable<detValorResponse[]> {
    const httpUrl = 'assets/mockup/VF' + codDvalor + '.json';
    const httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };

    return this._http.get<detValorResponse[]>(httpUrl, httpOptions);
  }

  getListaSeccionesImagen(
    codModeloDanyos: string
  ): Observable<ParteVehiculo[]> {
    const httpUrl = 'assets/images/vehiculo_' + codModeloDanyos + '.json';
    const httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };

    return this._http.get<ParteVehiculo[]>(httpUrl, httpOptions);
  }

  getSeccionesDanyadas(id: number): Observable<SectionsVehicleResponse> {
    const httpUrl = 'assets/mockup/saveId_' + id + '.json';
    const httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };

    return this._http.get<SectionsVehicleResponse>(httpUrl, httpOptions);
  }
}
