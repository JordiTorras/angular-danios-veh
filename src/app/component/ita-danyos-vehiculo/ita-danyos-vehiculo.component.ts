import { Component, Input, OnInit } from '@angular/core';
import { detValorResponse } from './class/detValores';
import {
  DanyosVehiculo,
  SeccionVehiculo,
  SeccionesVehiculoResponse,
  ParteVehiculo,
} from './class/seccionesVehiculo';
import { DanyosVehiculoService } from './services/danyos-vehiculo.service';

@Component({
  selector: 'app-ita-danyos-vehiculo',
  templateUrl: './ita-danyos-vehiculo.component.html',
  styleUrls: ['./ita-danyos-vehiculo.component.css'],
})
export class ItaDanyosVehiculoComponent implements OnInit {
  @Input() tipoVehiculo: string = ''; // valor por defecto

  public danyosVehiculo: DanyosVehiculo = {} as DanyosVehiculo; // Objeto con las secciones dañadas y su grado
  public lstMapVehiculo: ParteVehiculo[] = []; //lista de partes de la imagen

  public VF14: detValorResponse[] = []; // Nivel de daños sufridos en la secció del vehículo
  public VF15: detValorResponse[] = []; // Caracter de participación del vehículo en el siniestro

  // URL donde guardamos las imagenes de los diferentes tipos de vehículos, se sustituye MODELO por el codigo de vehículo
  urlImagen: string = 'assets/images/vehiculo_MODELO.png';

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
          (a: SeccionVehiculo, b: SeccionVehiculo) =>
            a.orden < b.orden ? -1 : a.orden > b.orden ? 1 : 0
        );

        this.danyosVehiculo.desDanyosLibre = '';
        this.danyosVehiculo.codCaracterParticipacion = '';
      });

    this.urlImagen = this.urlImagen.replace('MODELO', this.tipoVehiculo);

    this._danyosService
      .getListaSeccionesImagen(this.tipoVehiculo)
      .subscribe((resp: ParteVehiculo[]) => {
        this.lstMapVehiculo = resp.map((parte: ParteVehiculo) => {
          return {
            ...parte,
            nivelDanyos: 0,
          };
        });
        console.log(this.lstMapVehiculo);
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

  onChangeNivelDanyos(event: Event): void {
    /**
     * Cuando cambiamos el valor del Nivel de daños de una sección tambien actualizamos el atributo
     * .seleccionado a true.
     * Es el equivalente a indciar que dicha sección esta dañada
     */

    // obtenemos el CODIGO de la sección a partir de id del elemento HTML, los id tienen esta estructura sel-CODIGO
    // Transformarmos el event.target como elemento INPUT para poder acceder a sus atributos con typescript
    let codigo: string = (event.target as HTMLInputElement).id.substring(4);

    // Buscamos el indice del array de secciones a partir del codigo
    let index = this.danyosVehiculo.lstSeccionesDanyadas.findIndex(
      (item) => item.codigo === codigo
    );

    if (index == -1) return;

    // En función del nivel de daños activamos o desactivamos el atributo .seleccionado
    if ((event.target as HTMLInputElement).value !== '0') {
      this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado = true;
    } else {
      this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado = false;
    }

    // Actualizamos la parte grafica
    this.actualizarDibujo(codigo, +(event.target as HTMLInputElement).value);
  }

  onChangeCheck(event: Event): void {
    // obtenemos el CODIGO de la sección a partir de id del elemento HTML, los id tienen esta estructura sel-CODIGO
    // Transformarmos el event.target como elemento INPUT para poder acceder a sus atributos con typescript
    let codigo: string = (event.target as HTMLInputElement).id.substring(4);

    // Buscamos el indice del array de secciones a partir del codigo
    let index = this.danyosVehiculo.lstSeccionesDanyadas.findIndex(
      (item) => item.codigo === codigo
    );

    if (index == -1) return;

    if (this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado) {
      this.actualizarDibujo(codigo, 99);
    } else {
      this.actualizarDibujo(codigo, 0);
    }
  }

  /**
   * Cuando pulsamos subre una sección de la imagen, actualizamos la lista de secciones
   * dañadas del vehículo, sus atributos gravedad y seleccionado.
   * @param event
   * @returns
   */
  onClickSeccion(event: any) {
    // obtenemos el CODIGO de la parte de la imagen seleccionada, el id tiene el formato path-CODIGO

    let codigo: string = (event.target as HTMLInputElement).id.substring(5);

    // Buscamos el indice del array de secciones a partir del codigo
    let index = this.danyosVehiculo.lstSeccionesDanyadas.findIndex(
      (item) => item.codigo === codigo
    );

    if (index === -1) {
      return;
    }

    if (
      this.danyosVehiculo.lstSeccionesDanyadas[index].boolGravedadDanyo === true
    ) {
      /**
       *  Para las secciones que permiten nivel de daños
       *  - Aumentamos el nivel de daños
       * - Actualizamos el indicador de seleccionado
       * - Controlamos que no hayamos dado la vuelta al número de niveles VF:14
       */
      this.danyosVehiculo.lstSeccionesDanyadas[index].nivelDanyos += 1;

      if (
        this.danyosVehiculo.lstSeccionesDanyadas[index].nivelDanyos >
        this.VF14.length - 1
      ) {
        this.danyosVehiculo.lstSeccionesDanyadas[index].nivelDanyos = 0;
        this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado = false;
      } else {
        this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado = true;
      }

      this.actualizarDibujo(
        codigo,
        this.danyosVehiculo.lstSeccionesDanyadas[index].nivelDanyos
      );
    } else {
      /**
       *  Para las secciones de tipo Si / No actualizamos si la sección esta dañada
       */
      this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado =
        !this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado;

      if (this.danyosVehiculo.lstSeccionesDanyadas[index].seleccionado) {
        this.actualizarDibujo(codigo, 99);
      } else {
        this.actualizarDibujo(codigo, 0);
      }
    }
  }

  actualizarDibujo(codigo: string, nivelDanyos: number) {
    let index = this.lstMapVehiculo.findIndex((item) => item.codigo === codigo);

    if (index === -1) {
      return;
    }

    this.lstMapVehiculo[index].nivelDanyos = nivelDanyos;
  }
}
