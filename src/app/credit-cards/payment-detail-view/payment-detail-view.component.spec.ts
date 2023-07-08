import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailViewComponent } from './payment-detail-view.component';

describe('PaymentDetailViewComponent', () => {
  let component: PaymentDetailViewComponent;
  let fixture: ComponentFixture<PaymentDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
