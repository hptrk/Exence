import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-view-toggle',
  imports: [MatButtonToggleModule, CommonModule, FormsModule],
  templateUrl: './view-toggle.component.html',
  styleUrl: './view-toggle.component.scss',
})
export class ViewToggleComponent {
  selectedView: string = 'year';

  onViewChange(event: any) {
    console.log('selected view:', this.selectedView);
  }
}
