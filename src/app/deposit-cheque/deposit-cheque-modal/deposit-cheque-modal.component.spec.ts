import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositChequeModalComponent } from './deposit-cheque-modal.component';

describe('DepositChequeModalComponent', () => {
  let component: DepositChequeModalComponent;
  let fixture: ComponentFixture<DepositChequeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositChequeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositChequeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
