import { Component } from '@angular/core';
import { SummaryContainerComponent } from './summary-container/summary-container.component';

@Component({
  selector: 'app-dashboard',
  imports: [SummaryContainerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
