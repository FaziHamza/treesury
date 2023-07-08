import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationHistoryComponent } from './reconciliation-history.component';

describe('ReconciliationHistoryComponent', () => {
  let component: ReconciliationHistoryComponent;
  let fixture: ComponentFixture<ReconciliationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconciliationHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconciliationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
