import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableDialogComponent } from './data-table-dialog.component';

describe('DataTableDialogComponent', () => {
  let component: DataTableDialogComponent;
  let fixture: ComponentFixture<DataTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
