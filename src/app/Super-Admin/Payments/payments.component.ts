import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminDashboardComponent } from '../../Admin/Dashboard-Admin/Dashboard-Admin.component';
import { YouthTableComponent } from '../../Common/youth-table/youth-table.component';
import { EmployerTableComponent } from '../../Common/employer-table/employer-table.component';
import { JobRequestDetailsComponent } from '../../Employer/JobRequestDetails/job-request-details.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [ CommonModule, YouthTableComponent ,JobRequestDetailsComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})

export class PaymentsComponent {

}
