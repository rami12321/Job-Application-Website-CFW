import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { YouthChartComponent } from '../../Common/Charts/charts/charts.component';
import { EmployerService } from '../../Services/employer-service/employer-services.service';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AccordionModule,YouthChartComponent],
  templateUrl: './Dashboard-Admin.component.html',
  styleUrl: './Dashboard-Admin.component.css'
})
export class AdminDashboardComponent {
  youthData = { accepted: 0, rejected: 0, pending: 0, waiting:0};
  employerData = { inactive: 0, active: 0};
  jobData = { count: 0};
  constructor(private youthService: YouthServiceService ,private employerService: EmployerService ,private jobRequestService:JobRequestService) {}

  ngOnInit(): void {
    this.loadYouthData();
    this.loadEmployerData();
    this.loadJobsData();
  }

  loadYouthData(): void {
    this.youthService.getAllYouth().subscribe((data) => {
      this.youthData.accepted = data.filter((youth) => youth.status === 'accepted').length;
      this.youthData.rejected = data.filter((youth) => youth.status === 'rejected').length;
      this.youthData.pending = data.filter((youth) => youth.status === 'pending').length;
      this.youthData.waiting = data.filter((youth) => youth.status === 'waiting').length;
    });
  }
  loadEmployerData(): void {
    this.employerService.getAllEmployers().subscribe((data) => {
      this.employerData.inactive = data.filter((employer) => employer.active ==false).length;
      this.employerData.active = data.filter((employer) => employer.active ==true).length;
    });
  }
  loadJobsData(): void {
    this.jobRequestService.getAllJobs().subscribe((data) => {
      this.jobData.count = data.filter((employer) => employer ).length;
    });
  }

}
