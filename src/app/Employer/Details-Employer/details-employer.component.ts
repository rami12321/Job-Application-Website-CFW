import { Component, Input } from '@angular/core';
import {EmployerService} from '../../Services/employer-service/employer-services.service';
import { Employer } from '../../Model/Employer';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-employer',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './details-employer.component.html',
  styleUrl: './details-employer.component.css'
})
export class DetailsEmployerComponent {
  @Input() employerId!: string; // Accept the employer ID as input
  public employer: Employer | undefined;

  constructor(private employerService: EmployerService) {}

  ngOnInit(): void {
    if (this.employerId) {
      this.fetchEmployerDetails();
    }
  }

  ngOnChanges(): void {
    if (this.employerId) {
      this.fetchEmployerDetails();
    }
  }

  private fetchEmployerDetails(): void {
    this.employerService.getEmployerById(this.employerId).subscribe({
      next: (data: Employer) => {
        this.employer = data;
      },
      error: (err) => {
        console.error('Error fetching employer data:', err);
      }
    });
  }
}
