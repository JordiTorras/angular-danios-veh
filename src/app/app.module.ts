import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItaDanyosVehiculoComponent } from './component/ita-danyos-vehiculo/ita-danyos-vehiculo.component';
import { ItaDanyosVehiculoGraficoComponent } from './component/ita-danyos-vehiculo-grafico/ita-danyos-vehiculo-grafico.component';

@NgModule({
  declarations: [
    AppComponent,
    ItaDanyosVehiculoComponent,
    ItaDanyosVehiculoGraficoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
