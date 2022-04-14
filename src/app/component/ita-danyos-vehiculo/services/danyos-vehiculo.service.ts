import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpParamsOptions,
} from '@angular/common/http';
import {
  SeccionesVehiculoResponse,
  SeccionesVehiculo,
} from '../class/seccionesVehiculo';
import { Observable } from 'rxjs';

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
}
