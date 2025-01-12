import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseIncomeFormComponent } from './expense-income-form.component';

describe('ExpenseIncomeFormComponent', () => {
  let component: ExpenseIncomeFormComponent;
  let fixture: ComponentFixture<ExpenseIncomeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseIncomeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseIncomeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
