import { TestBed } from '@angular/core/testing';

import { DanyosVehiculoService } from './danyos-vehiculo.service';

describe('DanyosVehiculoService', () => {
  let service: DanyosVehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DanyosVehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
