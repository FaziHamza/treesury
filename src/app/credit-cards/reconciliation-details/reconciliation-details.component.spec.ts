import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationDetailsComponent } from './reconciliation-details.component';

describe('ReconciliationDetailsComponent', () => {
  let component: ReconciliationDetailsComponent;
  let fixture: ComponentFixture<ReconciliationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconciliationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconciliationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
