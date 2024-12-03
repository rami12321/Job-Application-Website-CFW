import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AccordionModule],
  templateUrl: './Dashboard-Admin.component.html',
  styleUrl: './Dashboard-Admin.component.css'
})
export class AdminDashboardComponent {
  youthData = { accepted: 0, rejected: 0, pending: 0, waiting:0};
  constructor(private youthService: YouthServiceService) {}

  ngOnInit(): void {
    this.loadYouthData();
  }

  loadYouthData(): void {
    this.youthService.getAllYouth().subscribe((data) => {
      this.youthData.accepted = data.filter((youth) => youth.status === 'accepted').length;
      this.youthData.rejected = data.filter((youth) => youth.status === 'rejected').length;
      this.youthData.pending = data.filter((youth) => youth.status === 'pending').length;
      this.youthData.waiting = data.filter((youth) => youth.status === 'waiting').length;
    });
  }

}
