import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  ParteVehiculo,
  SeccionesVehiculoResponse,
} from '../class/seccionesVehiculo';
import { Observable } from 'rxjs';
import { detValorResponse } from '../class/detValores';

@Injectable({
  providedIn: 'root',
})
export class DanyosVehiculoService {
  constructor(private _http: HttpClient) {}

  getListaSecciones(
    tipoVehiculo: string
  ): Observable<SeccionesVehiculoResponse> {
    /**
     * Recuperamos la lista de las secciones que componen el vehiculo en función de su tipologia
     *
     * TODO implementar el servicio
     */
    const httpUrl = 'assets/mockup/seccionesVehiculo_' + tipoVehiculo + '.json';
    const httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };

    return this._http.get<SeccionesVehiculoResponse>(httpUrl, httpOptions);
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

  getListaSeccionesImagen(tipoVehiculo: string): Observable<ParteVehiculo[]> {
    const httpUrl = 'assets/images/vehiculo_' + tipoVehiculo + '.json';
    const httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };

    return this._http.get<ParteVehiculo[]>(httpUrl, httpOptions);
  }
}
