import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { detValorResponse } from '../../ita-danyos-vehiculo/class/detValores';
import { PartesVehiculoResponse, ParteVehiculo } from '../class/partesVehiculo';

@Injectable({
  providedIn: 'root',
})
export class DanyosVehiculoGraficoService {
  constructor(private _http: HttpClient) {}

  getListaSeccionesImagen(tipoVehiculo: string): Observable<ParteVehiculo[]> {
    const httpUrl = 'assets/images/vehiculo_' + tipoVehiculo + '.json';
    const httpOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };

    return this._http.get<ParteVehiculo[]>(httpUrl, httpOptions);
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
}
