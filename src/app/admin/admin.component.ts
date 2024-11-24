import { Component } from '@angular/core';
import { SmartTableComponent } from '../Common/smart-table/smart-table.component';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SmartTableComponent,CommonModule,AdminDashboardComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab: string = 'dashboard'; // Default tab

  changeTab(tab: string): void {
    this.activeTab = tab;
  }
}
