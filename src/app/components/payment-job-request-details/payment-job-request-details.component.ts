import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { AttendanceService } from '../../Services/AttendanceService/attendance.service';
import { Job } from '../../Model/JobDetails';
import { AttendanceRecord } from '../../Model/Attendance';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-job-request-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-job-request-details.component.html',
  styleUrls: ['./payment-job-request-details.component.css']
})
export class PaymentJobRequestDetailsComponent implements OnInit {
  @Input() jobRequestDetails: any;
  @Input() selectedYouth: any;
  @Input() paymentHistory: any[] = [];
  @Input() attendanceRecord: any;

  @Output() refreshPaymentHistory = new EventEmitter<number>();

  refreshPayments(): void {
    const youthId = Number(this.selectedYouth.id);
    this.refreshPaymentHistory.emit(youthId);
  }

  public jobRequest: Job | undefined; // Property to store job request data

  constructor(
    private jobRequestService: JobRequestService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {}

  // Method to fetch job request details by youth ID
  fetchJobRequestByYouthId(youthId: string): void {
    this.jobRequestService.getJobRequestByYouthId(youthId).subscribe(
      (response) => {
        console.log('Job request details fetched successfully:', response);
        this.jobRequestDetails = response;
      },
      (error) => {
        console.error('Error fetching job request details:', error);
      }
    );
  }

  // Method to open the attendance modal
  openAttendanceModal(youth: any): void {
    if (!this.jobRequest || !youth) {
      console.error('Missing jobRequest or youth data');
      return;
    }

    // Save the selected youth for later use
    this.selectedYouth = youth;

    const jobId = this.jobRequest.jobId;
    if (!jobId) {
      console.error('Job ID is undefined');
      return;
    }

    // Fetch attendance records for the selected youth and job
    this.attendanceService.getAttendanceByYouthAndJob(youth.id, jobId).subscribe({
      next: (attendance: AttendanceRecord) => {
        // If days is a string, parse it into an array
        if (typeof attendance.days === 'string') {
          try {
            attendance.days = JSON.parse(attendance.days);
          } catch (error) {
            console.error('Error parsing days:', error);
            attendance.days = []; // Fallback to empty array
          }
        }
        this.attendanceRecord = attendance;
      },
      error: (err) => {
        console.error('Error fetching attendance record:', err);
      },
    });
  }

  // Method to close the attendance modal
  closeAttendanceModal(): void {
    this.selectedYouth = null; // Reset selected youth
    this.attendanceRecord = null; // Reset attendance records
  }
}