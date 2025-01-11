import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-data-table-dialog',
  imports: [MatDialogModule],
  templateUrl: './data-table-dialog.component.html',
  styleUrl: './data-table-dialog.component.scss',
})
export class DataTableDialogComponent {
  constructor(public dialogRef: MatDialogRef<DataTableDialogComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
