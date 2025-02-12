import { Component } from '@angular/core';
import { AdminService } from '../../Services/AdminService/admin.service';
import { Admin } from '../../Model/Admin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminDetailsComponent } from "../admin-details/admin-details.component";
import { DialogModule } from 'primeng/dialog';
import { AdminTableComponent } from "../Admin-Table/admin-table.component";


@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [FormsModule, CommonModule, AdminDetailsComponent, DialogModule, AdminTableComponent],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.css'
})
export class AdminManagementComponent {
  admin: Admin = {
    fullNameArabic: '',
    fullNameEnglish: '',
    personalEmail: '',
    organizationEmail: '',
    position: '',
    area: '',
    phoneNumber: '',
    active: true,
    role: 'admin'
  };
  activeAdminTab: string = 'active';

  // Dialog properties for viewing/editing admin details
  adminDialogVisible: boolean = false;
  selectedAdminId: string | null = null;
  showModal = false;
  
  constructor(private adminService: AdminService) {}
  openModal(): void {
    this.showModal = true;
  }
  setActiveTab(tab: string): void {
    this.activeAdminTab = tab;
  }

  // Open the dialog with the details of the selected admin (received from the table component)
  openAdminDetails(adminId: string): void {
    this.selectedAdminId = adminId;
    this.adminDialogVisible = true;
  }

  // Close the dialog and clear the selected admin ID
  closeAdminDialog(): void {
    this.adminDialogVisible = false;
    this.selectedAdminId = null;
  }

  closeModal(): void {
    this.showModal = false;
  }
  onSubmit(): void {
    this.adminService.createAdmin(this.admin).subscribe(
      response => {
        console.log('Admin created successfully:', response);
        this.closeModal(); // Optionally close the modal on success
      },
      error => {
        console.error('Error creating admin:', error);
      }
    );
  }
}
