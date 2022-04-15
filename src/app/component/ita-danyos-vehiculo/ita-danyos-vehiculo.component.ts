import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { detValorResponse } from './class/detValores';
import {
  DanyosVehiculo,
  Seccion,
  SeccionesVehiculoResponse,
} from './class/seccionesVehiculo';
import { DanyosVehiculoService } from './services/danyos-vehiculo.service';

@Component({
  selector: 'app-ita-danyos-vehiculo',
  templateUrl: './ita-danyos-vehiculo.component.html',
  styleUrls: ['./ita-danyos-vehiculo.component.css'],
})
export class ItaDanyosVehiculoComponent implements OnInit {
  @Input() tipoVehiculo: string = ''; // valor por defecto

  public danyosVehiculo: DanyosVehiculo = {
    codModeloDanyos: '',
    lstSeccionesDanyadas: [],
    codCaracterParticipacion: null,
    desDanyosLibre: null,
  };

  public VF14: detValorResponse[] = []; // Nivel de daños sufridos en la secció del vehículo
  public VF15: detValorResponse[] = []; // Caracter de participación del vehículo en el siniestro

  constructor(private _danyosService: DanyosVehiculoService) {}

  ngOnInit(): void {
    // Recuperamos la lista de secciones del vehúculo en función del tipo de siniestro
    this._danyosService
      .getListaSecciones(this.tipoVehiculo)
      .subscribe((resp: SeccionesVehiculoResponse) => {
        /**
         * Inicializamos el objeto de trabajo this.danyosVehiculo con la lista de secciones del vehículo
         * Las secciones se inicializan por defecto sin seleccionar y se ordenan.
         */
        this.danyosVehiculo.codModeloDanyos = resp.codigoListaSecciones;

        this.danyosVehiculo.lstSeccionesDanyadas = resp.secciones.map(
          (seccion) => {
            return {
              ...seccion,
              seleccionado: false,
              nivelDanyos: 0,
            };
          }
        );

        // Ordenamos las piezas del vehiculo por el campo "orden"
        this.danyosVehiculo.lstSeccionesDanyadas.sort(
          (a: Seccion, b: Seccion) =>
            a.orden < b.orden ? -1 : a.orden > b.orden ? 1 : 0
        );

        this.danyosVehiculo.desDanyosLibre = '';
        this.danyosVehiculo.codCaracterParticipacion = '';
      });

    // Recuperammos el catalogo de Niveles de daño del vehículo
    this._danyosService
      .getDetValores('14')
      .subscribe((resp: detValorResponse[]) => {
        this.VF14 = resp;
      });

    // Recuperamos el catalogo del Caracter de participación en el siniestro
    this._danyosService
      .getDetValores('15')
      .subscribe((resp: detValorResponse[]) => {
        this.VF15 = resp;
      });
  }

  ngOnChanges() {}

  onChangeNivelDanyos(event: Event): void {
    /**
     * Cuando cambiamos el valor del Nivel de daños de una sección tambien actualizamos el atributo
     * .seleccionado a true.
     * Es el equivalente a indciar que dicha sección esta dañada
     */

    // obtenemos el CODIGO de la sección a partir de id del elemento HTML, los id tienen esta estructura sel-CODIGO
    // Transformarmos el event.target como elemento INPUT para poder acceder a sus atributos con typescript
    let codigoSeccionModificada: string = (
      event.target as HTMLInputElement
    ).id.substring(4);

    // Buscamos el indice del array de secciones a partir del codigo
    let index = this.danyosVehiculo.lstSeccionesDanyadas.findIndex(
      (item) => item.codigo === codigoSeccionModificada
    );

    // En función del nivel de daños activamos o desactivamos el atributo .seleccionado
    if ((event.target as HTMLInputElement).value !== '0') {
      this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado = true;
    } else {
      this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado = false;
    }
  }
}
