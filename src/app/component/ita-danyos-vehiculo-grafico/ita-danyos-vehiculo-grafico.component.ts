import { Component, Input, OnInit } from '@angular/core';
import { detValorResponse } from '../ita-danyos-vehiculo/class/detValores';
import { SeccionVehiculo } from '../ita-danyos-vehiculo/class/seccionesVehiculo';
import { PartesVehiculoResponse, ParteVehiculo } from './class/partesVehiculo';
import { DanyosVehiculoGraficoService } from './services/danyos-vehiculo-grafico.service';

@Component({
  selector: 'app-ita-danyos-vehiculo-grafico',
  templateUrl: './ita-danyos-vehiculo-grafico.component.html',
  styleUrls: ['./ita-danyos-vehiculo-grafico.component.css'],
})
export class ItaDanyosVehiculoGraficoComponent implements OnInit {
  @Input() tipoVehiculo: string = '';
  @Input() codModeloDanyos: string = '';

  public lstSeccionesDanyadas: SeccionVehiculo[] = [];

  public lstPartesVehiculo: ParteVehiculo[] = []; //lista de partes de la imagen

  public VF14: detValorResponse[] = []; // Nivel de daños sufridos en la secció del vehículo

  urlImagen: string = 'assets/images/vehiculo_MODELO.png';

  constructor(private _danyosService: DanyosVehiculoGraficoService) {}

  ngOnInit(): void {
    this.urlImagen = this.urlImagen.replace('MODELO', this.tipoVehiculo);

    this._danyosService
      .getListaSeccionesImagen(this.tipoVehiculo)
      .subscribe((resp: ParteVehiculo[]) => {
        this.lstPartesVehiculo = resp.map((parte: ParteVehiculo) => {
          return {
            codigo: parte.codigo,
            descripcion: parte.descripcion,
            coords: parte.coords,
          };
        });
        console.log(this.lstPartesVehiculo);
      });

    // Recuperammos el catalogo de Niveles de daño del vehículo
    this._danyosService
      .getDetValores('14')
      .subscribe((resp: detValorResponse[]) => {
        this.VF14 = resp;
      });
  }

  ngOnchange(): void {}

  onClickSeccion(event: any) {
    //obtenemos el id de la sección seleccionada
    console.log(event.target.id);

    //
  }
}
