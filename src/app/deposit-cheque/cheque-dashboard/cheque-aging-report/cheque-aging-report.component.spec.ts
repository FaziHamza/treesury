import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeAgingReportComponent } from './cheque-aging-report.component';

describe('ChequeAgingReportComponent', () => {
  let component: ChequeAgingReportComponent;
  let fixture: ComponentFixture<ChequeAgingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeAgingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeAgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
