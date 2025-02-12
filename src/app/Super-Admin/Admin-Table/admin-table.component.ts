import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Admin } from '../../Model/Admin';
import { AdminService } from '../../Services/AdminService/admin.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [MultiSelectModule,DialogModule,TableModule,CommonModule],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.css'
})
export class AdminTableComponent implements OnInit, OnChanges {
  @Input() active: boolean | undefined;
  // Emit the admin ID when the user clicks View/Edit.
  @Output() viewAdminEvent = new EventEmitter<string>();

  admins: Admin[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchAdmins();
  }

  // Fetch all admins from the service and filter by the active property.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']) {
      this.fetchAdmins();
    }
  }

  // Fetch all admins and filter by the active flag.
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

  // Emit the selected admin ID for viewing/editing.
  onViewAdmin(adminId: string): void {
    this.viewAdminEvent.emit(adminId);
  }

  // Delete an admin after confirmation.
  deleteAdmin(adminId: string): void {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(adminId).subscribe(() => {
        this.fetchAdmins();
      });
    }
  }
}
