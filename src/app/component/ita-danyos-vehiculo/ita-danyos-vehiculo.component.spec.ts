import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItaDanyosVehiculoComponent } from './ita-danyos-vehiculo.component';

describe('ItaDanyosVehiculoComponent', () => {
  let component: ItaDanyosVehiculoComponent;
  let fixture: ComponentFixture<ItaDanyosVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItaDanyosVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItaDanyosVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
