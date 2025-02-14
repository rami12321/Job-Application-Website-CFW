import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { Admin } from '../../Model/Admin';
import { AdminService } from '../../Services/AdminService/admin.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [MultiSelectModule, DialogModule, TableModule, CommonModule, FormsModule],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.css'
})
export class AdminTableComponent implements OnInit, OnChanges {
  @Input() active: boolean | undefined;
  @Output() viewAdminEvent = new EventEmitter<string>();
  selectedAdminId: string | null = null;
  // Control the visibility of the details dialog.
  isAdminDialogOpen: boolean = false;
  admins: Admin[] = [];
  cols: { field: string; header: string }[] = [];
  savedColumns: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'fullNameEnglish', header: 'Full Name (English)' },
    { field: 'fullNameArabic', header: 'Full Name (Arabic)' },
    { field: 'personalEmail', header: 'Personal Email' },
    { field: 'organizationEmail', header: 'Organization Email' },
    { field: 'position', header: 'Position' },
    { field: 'area', header: 'Area' },
    { field: 'phoneNumber', header: 'Phone Number' },
    { field: 'role', header: 'Role' },
    { field: 'active', header: 'Status' }
  ];
  minTableWidth: string = '50rem';
  isDeleteModalOpen = false;
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.fetchAdmins();
    this.adjustTableWidth();

  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustTableWidth();
  }

  private adjustTableWidth(): void {
    // If screen width is less than 800px, remove the forced min-width.
    if (window.innerWidth < 800) {
      this.minTableWidth = 'auto';
    } else {
      this.minTableWidth = '50rem';
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']) {
      this.fetchAdmins();
    }
  }

  // Fetch all admins from the service and filter by active status.
  fetchAdmins(): void {
    this.adminService.getAllAdmins().subscribe((data: Admin[]) => {
      this.admins = data.filter(admin => admin.active === this.active);
    });
  }

  // Toggle an admin's active status and refresh the list.
  updateActiveStatus(adminId: string, status: boolean): void {
    this.adminService.updateAdminStatus(adminId, status).subscribe(() => {
      this.fetchAdmins();
    });
  }

  // Emit event when an admin is viewed.
  onViewAdmin(adminId: string): void {
    this.viewAdminEvent.emit(adminId);
  }

  // Delete an admin after confirmation.
  openDeleteModal(adminId: string): void {
    this.selectedAdminId = adminId;
    this.isDeleteModalOpen = true;
  }
  
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedAdminId = null;
  }
  
  confirmDelete(): void {
    if (this.selectedAdminId) {
      this.adminService.deleteAdmin(this.selectedAdminId).subscribe(() => {
        this.fetchAdmins();
        this.closeDeleteModal();
      });
    }}

  // Initialize column selection from local storage or default
  initializeColumns(): void {
    const saved = localStorage.getItem('adminTableColumns');
    this.cols = saved ? JSON.parse(saved) : this.savedColumns;
  }

  // Save selected columns to local storage
  saveSelectedColumnsToLocalStorage(): void {
    localStorage.setItem('adminTableColumns', JSON.stringify(this.cols));
  }

  // Reset columns to default
  resetSelectedColumns(): void {
    this.cols = [...this.savedColumns];
    this.saveSelectedColumnsToLocalStorage();
  }
}
