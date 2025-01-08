import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtsComponent } from './debts.component';

describe('DebtsComponent', () => {
  let component: DebtsComponent;
  let fixture: ComponentFixture<DebtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
