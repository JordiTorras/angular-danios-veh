import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItaDanyosVehiculoComponent } from './component/ita-danyos-vehiculo/ita-danyos-vehiculo.component';

@NgModule({
  declarations: [AppComponent, ItaDanyosVehiculoComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
