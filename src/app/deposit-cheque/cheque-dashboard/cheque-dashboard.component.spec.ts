import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeDashboardComponent } from './cheque-dashboard.component';

describe('ChequeDashboardComponent', () => {
  let component: ChequeDashboardComponent;
  let fixture: ComponentFixture<ChequeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
