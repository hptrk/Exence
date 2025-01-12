import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoryFormComponent } from './new-category-form.component';

describe('NewCategoryFormComponent', () => {
  let component: NewCategoryFormComponent;
  let fixture: ComponentFixture<NewCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCategoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
