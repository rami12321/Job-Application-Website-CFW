import { Component, OnInit } from '@angular/core';
import { SmartTableComponent } from '../../Common/smart-table/smart-table.component';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from '../Dashboard-Admin/Dashboard-Admin.component';

@Component({
  selector: 'app-Main-Admin',
  standalone: true,
  imports: [SmartTableComponent,CommonModule,AdminDashboardComponent],
  templateUrl: './Main-Admin.component.html',
  styleUrls: ['./Main-Admin.component.css']
})
export class MainAdminComponent implements OnInit {

  activeTab: string = 'dashboard'; // Default tab

  constructor() { }

  ngOnInit() {
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

}
