import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChequeChartComponent } from './dashboard-cheque-chart.component';

describe('DashboardChequeChartComponent', () => {
  let component: DashboardChequeChartComponent;
  let fixture: ComponentFixture<DashboardChequeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardChequeChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardChequeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
