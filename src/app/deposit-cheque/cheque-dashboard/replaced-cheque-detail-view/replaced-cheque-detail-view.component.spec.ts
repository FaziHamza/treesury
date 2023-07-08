import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacedChequeDetailViewComponent } from './replaced-cheque-detail-view.component';

describe('ReplacedChequeDetailViewComponent', () => {
  let component: ReplacedChequeDetailViewComponent;
  let fixture: ComponentFixture<ReplacedChequeDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplacedChequeDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplacedChequeDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
