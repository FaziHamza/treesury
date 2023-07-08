import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositChequeComponent } from './deposit-cheque.component';

describe('DepositChequeComponent', () => {
  let component: DepositChequeComponent;
  let fixture: ComponentFixture<DepositChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositChequeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
