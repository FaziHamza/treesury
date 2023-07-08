import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardsPaymentComponent } from './credit-cards-payment.component';

describe('CreditCardsPaymentComponent', () => {
  let component: CreditCardsPaymentComponent;
  let fixture: ComponentFixture<CreditCardsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardsPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
