import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Admin } from '../../Model/Admin';
import { AdminService } from '../../Services/AdminService/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.css']
})
export class AdminDetailsComponent implements OnChanges {
  @Input() adminId!: string; // Pass the admin ID from the parent (e.g., when clicking the view button)
  public admin: Admin | undefined;
  public isEditing: boolean = false;
  public editModel: Partial<Admin> = {};

  constructor(private adminService: AdminService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adminId'] && this.adminId) {
      this.fetchAdminDetails();
    }
  }

  fetchAdminDetails(): void {
    this.adminService.getAdminById(this.adminId).subscribe({
      next: (data: Admin) => {
        this.admin = data;
      },
      error: (err) => {
        console.error('Error fetching admin details:', err);
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
    // Make a deep copy of the admin data to edit
    this.editModel = { ...this.admin };
  }

  saveChanges(): void {
    if (!this.admin) return;

    this.adminService.updateAdmin(this.adminId, this.editModel).subscribe({
      next: () => {
        // Update the local admin object with the edited values
        this.admin = { ...this.admin, ...this.editModel } as Admin;
        this.isEditing = false;
        window.location.reload();

      },
      error: (err) => {
        console.error('Error updating admin details:', err);
      }
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editModel = {};
  }
}
