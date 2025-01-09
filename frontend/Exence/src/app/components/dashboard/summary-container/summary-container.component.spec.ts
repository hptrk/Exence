import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryContainerComponent } from './summary-container.component';

describe('SummaryContainerComponent', () => {
  let component: SummaryContainerComponent;
  let fixture: ComponentFixture<SummaryContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
