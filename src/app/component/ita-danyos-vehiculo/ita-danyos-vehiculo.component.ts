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
    codModeloDanyos: null,
    seccionesDanyadas: [],
    codCaracterParticipacion: null,
    descripcionLibre: null,
  };

  public VF14: detValorResponse[] = []; // Nivel de daños sufridos en la secció del vehículo
  public VF15: detValorResponse[] = []; // Caracter de participación del vehículo en el siniestro

  constructor(private _danyosService: DanyosVehiculoService) {}

  ngOnInit(): void {
    this._danyosService
      .getListaSecciones(this.tipoVehiculo)
      .subscribe((resp: SeccionesVehiculoResponse) => {
        // Trasnformarmamos la repuesta al formato que esperamos
        this.danyosVehiculo.codModeloDanyos = resp.codigoListaSecciones;

        for (let seccion of resp.secciones) {
          let s: Seccion = {
            codigo: seccion.codigo,
            orden: seccion.orden,
            descripcion: seccion.descripcion,
            classificacion: seccion.classificacion,
            boolGravedadDanyo: seccion.boolGravedadDanyo,
            seleccionado: false, // falor por defecteo
            nivelDanyos: 0, // valor por defecto
          };

          this.danyosVehiculo.seccionesDanyadas.push(s);
        }

        // Ordenamos las piezas del vehiculo por el campo "orden"
        this.danyosVehiculo.seccionesDanyadas.sort((a: Seccion, b: Seccion) =>
          a.orden < b.orden ? -1 : a.orden > b.orden ? 1 : 0
        );
      });

    this._danyosService
      .getDetValores('14')
      .subscribe((resp: detValorResponse[]) => {
        this.VF14 = resp;
      });

    this._danyosService
      .getDetValores('15')
      .subscribe((resp: detValorResponse[]) => {
        this.VF15 = resp;
      });
  }

  ngOnChanges() {}

  onChangeNivelDanyos(event: Event): void {
    //console.log(event);
    // console.log(event.srcElement);
    // console.log(event.target.id); //el id del component
    //console.log(event.target.value);

    let codigoSeccionModificada: string = (
      event.target as HTMLInputElement
    ).id.substring(4);

    //console.log(codigoSeccionModificada);

    let index = this.danyosVehiculo.seccionesDanyadas.findIndex(
      (item) => item.codigo === codigoSeccionModificada
    );

    if ((event.target as HTMLInputElement).value !== '0') {
      this.danyosVehiculo.seccionesDanyadas[index].seleccionado = true;
    } else {
      this.danyosVehiculo.seccionesDanyadas[index].seleccionado = false;
    }
  }
}
