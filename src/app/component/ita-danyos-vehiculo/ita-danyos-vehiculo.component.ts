import { PropertyRead, ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { detValorResponse } from './class/detValores';
import {
  ParteVehiculo,
  SectionsVehicleResponse,
  SectionVehicle,
  VehicleDamage,
} from './class/seccionesVehiculo';
import { DanyosVehiculoService } from './services/danyos-vehiculo.service';

@Component({
  selector: 'app-ita-danyos-vehiculo',
  templateUrl: './ita-danyos-vehiculo.component.html',
  styleUrls: ['./ita-danyos-vehiculo.component.css'],
})
export class ItaDanyosVehiculoComponent implements OnInit {
  @Input() tipoVehiculo: string = ''; // valor por defecto
  @Input() idDanyos: any = null; // id de los daños a recuperar de la bdd

  public danyosVehiculo: VehicleDamage = {} as VehicleDamage; // Objeto con las secciones dañadas y su grado
  public lstMapVehiculo: ParteVehiculo[] = []; //lista de partes de la imagen

  public VF14: detValorResponse[] = []; // Nivel de daños sufridos en la secció del vehículo
  public VF15: detValorResponse[] = []; // Caracter de participación del vehículo en el siniestro

  // TODO URL donde guardamos las imagenes de los diferentes tipos de vehículos, se sustituye MODELO por el codigo de vehículo
  urlBaseImagen: string = 'assets/images/vehiculo_MODELO.png';
  urlImagen: string = '';

  private DANYOS_MENORES: number = 99;

  constructor(private _danyosService: DanyosVehiculoService) {}

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoVehiculo']) {
      this.cargarListaSeccionesDanyos(this.tipoVehiculo);
    }

    if (changes['idDanyos']) {
      this.cargarDatosVehiculoDanyado(this.idDanyos);
    }
  }

  /**
   * Dado un tipo de vehículo, recupera la lista de secciones que pueden ser dañadas del vehículo
   * @param tipoVehiculo
   * @returns
   */
  cargarListaSeccionesDanyos(tipoVehiculo: string) {
    if (tipoVehiculo == '') return;

    this.danyosVehiculo = {} as VehicleDamage;

    // Recuperamos la lista de secciones del vehículo en función del tipo de siniestro
    this._danyosService
      .getListaSecciones(this.tipoVehiculo)
      .subscribe((resp: SectionsVehicleResponse) => {
        /**
         * Inicializamos el objeto de trabajo this.danyosVehiculo con la lista de secciones del vehículo
         * Las secciones se inicializan por defecto sin seleccionar y se ordenan.
         */
        this.danyosVehiculo.codDamageModel = resp.codDamageModel;

        this.danyosVehiculo.damageSections = resp.damageSections.map(
          (seccion) => {
            return {
              ...seccion,
              selected: false,
              damageLevel: 0,
            };
          }
        );

        // Ordenamos las piezas del vehiculo por el campo "orden"
        this.danyosVehiculo.damageSections.sort(
          (a: SectionVehicle, b: SectionVehicle) =>
            a.order < b.order ? -1 : a.order > b.order ? 1 : 0
        );

        this.danyosVehiculo.damageDescription = '';
        this.danyosVehiculo.characterParticipation = '';

        /**
         * Despues de cargar la lista de secciones, cargamos la imagen del vehiculo
         * correpondiente al modelo de daños
         */
        this.cargarListaMapaVehiculo(this.danyosVehiculo.codDamageModel);
      });
  }

  /**
   * Recupera y crea la lista de las diferentes partes que forman parte de la imagen del vehículo
   * para realizar la representación grafica de los daños.
   * @param codModeloDanyos
   * @returns
   */
  cargarListaMapaVehiculo(codModeloDanyos: string) {
    if (codModeloDanyos == '') return;
    // Inicializamos las lista de trabajo
    this.lstMapVehiculo = [];

    // Copiamos la url Base y sustituimos MODELO por el codigo correspondiente
    this.urlImagen = this.urlBaseImagen;
    this.urlImagen = this.urlImagen.replace('MODELO', codModeloDanyos);

    this._danyosService
      .getListaSeccionesImagen(codModeloDanyos)
      .subscribe((resp: ParteVehiculo[]) => {
        this.lstMapVehiculo = resp.map((parte: ParteVehiculo) => {
          return {
            ...parte,
            nivelDanyos: 0,
          };
        });

        /**
         * Actualizamos la imagen del vehículo con las secciones dañadas
         */
        if (this.danyosVehiculo.idVehicleDamaged) {
          this.actualizarDanyosImagen();
        }
      });
  }

  /**
   * Actualiza la lista de partes dañadas de la imagen grafica a partir de las secciones dañadas
   */
  actualizarDanyosImagen() {
    this.danyosVehiculo.damageSections.forEach((item) => {
      if (item.selected == true) {
        if (item.boolSeverityDamage == true)
          this.actualizarNivelDanyosImagen(item.code, item.damageLevel);
        else this.actualizarNivelDanyosImagen(item.code, this.DANYOS_MENORES);
      }
    });
  }

  /**
   * Cuando cambiamos el valor del Nivel de daños de una sección tambien actualizamos el atributo
   * .seleccionado a true, para indicar que diacha sección esta dañada
   * @param event
   * @returns
   */
  onChangeNivelDanyos(event: Event): void {
    // obtenemos el CODIGO de la sección a partir de id del elemento HTML, los id tienen esta estructura sel-CODIGO
    // Transformarmos el event.target como elemento INPUT para poder acceder a sus atributos con typescript
    let codigo: string = (event.target as HTMLInputElement).id.substring(4);

    // Buscamos el indice del array de secciones a partir del codigo
    let index = this.danyosVehiculo.damageSections.findIndex(
      (item) => item.code === codigo
    );

    if (index == -1) return;

    // En función del nivel de daños activamos o desactivamos el atributo .seleccionado
    if ((event.target as HTMLInputElement).value !== '0') {
      this.danyosVehiculo.damageSections[index].selected = true;
    } else {
      this.danyosVehiculo.damageSections[index].selected = false;
    }

    // Actualizamos la parte grafica
    this.actualizarNivelDanyosImagen(
      codigo,
      +(event.target as HTMLInputElement).value
    );
  }

  onChangeCheck(event: Event): void {
    /**
     * obtenemos el CODIGO de la sección a partir de id del elemento HTML, los id tienen esta estructura sel-CODIGO
     * Transformarmos el event.target como elemento INPUT para poder acceder a sus atributos con typescript
     */
    let codigo: string = (event.target as HTMLInputElement).id.substring(4);

    // Buscamos el indice del array de secciones a partir del codigo
    let index = this.danyosVehiculo.damageSections.findIndex(
      (item) => item.code === codigo
    );

    if (index == -1) return;

    if (this.danyosVehiculo.damageSections[index].selected) {
      this.actualizarNivelDanyosImagen(codigo, this.DANYOS_MENORES);
    } else {
      this.actualizarNivelDanyosImagen(codigo, 0);
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
    let index = this.danyosVehiculo.damageSections.findIndex(
      (item) => item.code === codigo
    );

    if (index === -1) {
      return;
    }

    if (this.danyosVehiculo.damageSections[index].boolSeverityDamage === true) {
      /**
       *  Para las secciones que permiten nivel de daños
       *  - Aumentamos el nivel de daños
       * - Actualizamos el indicador de seleccionado
       * - Controlamos que no hayamos dado la vuelta al número de niveles VF:14
       */
      this.danyosVehiculo.damageSections[index].damageLevel += 1;

      if (
        this.danyosVehiculo.damageSections[index].damageLevel >
        this.VF14.length - 1
      ) {
        this.danyosVehiculo.damageSections[index].damageLevel = 0;
        this.danyosVehiculo.damageSections[index].selected = false;
      } else {
        this.danyosVehiculo.damageSections[index].selected = true;
      }

      this.actualizarNivelDanyosImagen(
        codigo,
        this.danyosVehiculo.damageSections[index].damageLevel
      );
    } else {
      /**
       *  Para las secciones de tipo Si / No actualizamos si la sección esta dañada
       */
      this.danyosVehiculo.damageSections[index].selected =
        !this.danyosVehiculo.damageSections[index].selected;

      if (this.danyosVehiculo.damageSections[index].selected) {
        this.actualizarNivelDanyosImagen(codigo, this.DANYOS_MENORES);
      } else {
        this.actualizarNivelDanyosImagen(codigo, 0);
      }
    }
  }

  /**
   * Actualizamos el nivel de gravedad de daños de la parte de la imagen
   * Para que al renderizar, aplique el estilo CSS .danyosN donde N es el nivel de gravedad
   * @param codigo
   * @param nivelDanyos
   * 0 - Sin daños
   * n - Nivel de daños
   * 99 - Reservado para cristales (daños menores) que no tienen nivel de graveda
   * @returns
   */
  actualizarNivelDanyosImagen(codigo: string, nivelDanyos: number): void {
    let index = this.lstMapVehiculo.findIndex((item) => item.codigo === codigo);

    if (index === -1) {
      return;
    }

    this.lstMapVehiculo[index].nivelDanyos = nivelDanyos;
  }

  /**
   * Cuando llamamos al componente con el idDanyo
   * @param id
   * @returns
   */

  cargarDatosVehiculoDanyado(id: number) {
    if (id === null) return;

    // Inicializamos la lista de daños del vehiculo
    this.danyosVehiculo = {} as VehicleDamage;

    // Recuperamos la lista de secciones del vehículo en función del tipo de siniestro
    this._danyosService
      .getSeccionesDanyadas(id)
      .subscribe((resp: SectionsVehicleResponse) => {
        /**
         * Inicializamos el objeto de trabajo this.danyosVehiculo con la lista de secciones del vehículo
         * Las secciones se inicializan por defecto sin seleccionar y se ordenan.
         */
        if (resp.idVehicleDamaged)
          this.danyosVehiculo.idVehicleDamaged = resp.idVehicleDamaged;

        this.danyosVehiculo.codDamageModel = resp.codDamageModel;

        this.danyosVehiculo.damageSections = resp.damageSections;

        // Ordenamos las piezas del vehiculo por el campo "orden"
        this.danyosVehiculo.damageSections.sort(
          (a: SectionVehicle, b: SectionVehicle) =>
            a.order < b.order ? -1 : a.order > b.order ? 1 : 0
        );

        if (resp.damageDescription)
          this.danyosVehiculo.damageDescription = resp.damageDescription;

        if (resp.characterParticipation)
          this.danyosVehiculo.characterParticipation =
            resp.characterParticipation;

        /**
         * Despues de cargar la lista de secciones, cargamos la imagen del vehiculo
         * correpondiente al modelo de daños
         */
        this.cargarListaMapaVehiculo(this.danyosVehiculo.codDamageModel);
      });
  }
}
