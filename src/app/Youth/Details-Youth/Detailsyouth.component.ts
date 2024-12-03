import { Component, Input, OnInit } from '@angular/core';
import { Youth } from '../../Model/Youth';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';

@Component({
  selector: 'app-youthsignup-details',
  standalone: true,
  imports: [CommonModule, TabViewModule, ReactiveFormsModule, MatTabsModule],
  templateUrl: './Detailsyouth.component.html',
  styleUrls: ['./Detailsyouth.component.css'],
})
export class YouthSignupDetailsComponent implements OnInit {
  @Input() youthId!: number; // Accept ID from parent
  public youth: Youth | undefined;

  constructor(private youthService: YouthServiceService) {}

  ngOnInit(): void {
    if (this.youthId) {
      this.fetchYouthDetails();
    }
  }

  ngOnChanges(): void {
    if (this.youthId) {
      this.fetchYouthDetails();
    }
  }

  private fetchYouthDetails(): void {
    this.youthService.getYouthById(this.youthId).subscribe({
      next: (data: Youth) => {
        this.youth = data;
      },
      error: (err) => {
        console.error('Error fetching youth data:', err);
      },
    });
  }
}
