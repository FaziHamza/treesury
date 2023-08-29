import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositChequeDetailModalComponent } from './deposit-cheque-detail-modal.component';

describe('DepositChequeDetailModalComponent', () => {
  let component: DepositChequeDetailModalComponent;
  let fixture: ComponentFixture<DepositChequeDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositChequeDetailModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositChequeDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
