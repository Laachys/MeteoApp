import { TestBed } from '@angular/core/testing';

import { DataWeatherService } from './data-weather.service';

describe('DataWeatherService', () => {
  let service: DataWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
