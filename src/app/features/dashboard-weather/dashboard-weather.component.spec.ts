import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWeatherComponent } from './dashboard-weather.component';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('DashboardWeatherComponent', () => {
  let component: DashboardWeatherComponent;
  let fixture: ComponentFixture<DashboardWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       declarations: [DashboardWeatherComponent],
        imports: [CommonModule, NgxChartsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
