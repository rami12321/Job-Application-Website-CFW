import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminManagementComponent } from "../Admin-Management/admin-management.component";
import { PaymentsComponent } from "../Payments/payments.component";

@Component({
    standalone: true,selector: 'app-super-admin',
  
    imports: [CommonModule, AdminManagementComponent, PaymentsComponent],
    templateUrl: './super-admin.component.html',
    styleUrl: './super-admin.component.css'
})
export class SuperAdminComponent {
  activeTab: 'admin-management' | 'payments' = 'admin-management';

  changeTab(tab: 'admin-management' | 'payments'): void {
    this.activeTab = tab;
  }

}


