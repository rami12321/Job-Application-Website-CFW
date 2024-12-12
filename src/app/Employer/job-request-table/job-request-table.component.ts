import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { Job } from '../../Model/JobDetails';
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-job-request-table',
  standalone: true,
  imports: [TreeTableModule, ButtonModule, CommonModule],
  templateUrl: './job-request-table.component.html',
  styleUrl: './job-request-table.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})

export class JobRequestTableComponent {
  files!: TreeNode[];

  cols!: Column[];

  constructor( private jobRequestService: JobRequestService
  ) {}

  ngOnInit() {
    // Mock data for testing
    const mockJobs = [
      { id: '1', title: 'Software Engineer', numEmployees: 5, level: 'Mid', location: 'Remote', typeOfJob: 'Full-time', supervisorName: 'John Doe', supervisorPosition: 'Manager', supervisorEmail: 'john.doe@example.com', supervisorPhone: '123-456-7890' },
      { id: '2', title: 'Product Manager', numEmployees: 3, level: 'Senior', location: 'New York', typeOfJob: 'Part-time', supervisorName: 'Jane Smith', supervisorPosition: 'Lead', supervisorEmail: 'jane.smith@example.com', supervisorPhone: '098-765-4321' },
      { id: '3', title: 'UI/UX Designer', numEmployees: 2, level: 'Junior', location: 'San Francisco', typeOfJob: 'Contract', supervisorName: 'Alice Brown', supervisorPosition: 'Lead Designer', supervisorEmail: 'alice.brown@example.com', supervisorPhone: '567-890-1234' },
    ];

    // Map mock data to the required TreeNode format
    this.files = mockJobs.map(job => ({
      data: job,
      label: job.title, // Display the title in the tree table
    }));

    // Define table columns
    this.cols = [
      { field: 'title', header: 'Title' },
      { field: 'numEmployees', header: 'Number of Employees' },
      { field: 'level', header: 'Level' },
      { field: 'location', header: 'Location' },
      { field: 'typeOfJob', header: 'Type of Job' },
      { field: 'supervisorName', header: 'Supervisor Name' },
      { field: '', header: '' }
    ];
  }
}
