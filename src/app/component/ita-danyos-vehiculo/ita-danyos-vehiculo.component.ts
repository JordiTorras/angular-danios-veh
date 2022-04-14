import { INFERRED_TYPE } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import {
  SeccionesVehiculo,
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

  codCaracterParticipacion: string = '';
  descripcionDanyos: string = '';
  listaSecciones: SeccionesVehiculo = {
    codigoListaSecciones: '',
    secciones: [],
  };

  constructor(private _service: DanyosVehiculoService) {}

  ngOnInit(): void {
    this._service
      .getListaSecciones(this.tipoVehiculo)
      .subscribe((resp: SeccionesVehiculoResponse) => {
        // Trasnformarmamos la repuesta al formato que esperamos, como ambos tipos coinciden
        // unicament los asignamos y no es necesario realizar ninguna transformación
        this.listaSecciones = resp;
        console.log(this.listaSecciones);
      });
  }

  ngOnChanges() {}
}
