import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositChequeDetailComponent } from './deposit-cheque-detail.component';

describe('DepositChequeDetailComponent', () => {
  let component: DepositChequeDetailComponent;
  let fixture: ComponentFixture<DepositChequeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositChequeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositChequeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
