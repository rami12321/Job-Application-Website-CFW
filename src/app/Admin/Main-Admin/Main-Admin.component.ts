import { Component, Input, OnInit } from '@angular/core';
import { SmartTableComponent } from '../../Common/smart-table/smart-table.component';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from '../Dashboard-Admin/Dashboard-Admin.component';

@Component({
  selector: 'app-Main-Admin',
  standalone: true,
  imports: [SmartTableComponent, CommonModule, AdminDashboardComponent],
  templateUrl: './Main-Admin.component.html',
  styleUrls: ['./Main-Admin.component.css']
})
export class MainAdminComponent implements OnInit {
  @Input() status: string | undefined;

  activeTab: string = 'dashboard';
  activeYouthTab: string = 'waiting';

  constructor() {}

  ngOnInit() {
    // Load saved tab states from localStorage on initialization
    const savedTab = localStorage.getItem('activeTab');
    const savedYouthTab = localStorage.getItem('activeYouthTab');

    if (savedTab) {
      this.activeTab = savedTab;
    }
    if (savedYouthTab) {
      this.activeYouthTab = savedYouthTab;
    }
  }

  changeYouthTab(tab: string): void {
    this.activeYouthTab = tab;
    localStorage.setItem('activeYouthTab', tab); // Save youth tab state to localStorage
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab); // Save main tab state to localStorage
  }
}
