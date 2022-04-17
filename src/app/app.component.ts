import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-danios-veh';

  tipoVehiculo: string = '';
  idDanyos: number | null = null;
}
