import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../../Model/JobDetails';

@Injectable({
  providedIn: 'root'
})
export class JobRequestService {

  private JobRequestsUrl = 'http://localhost:3000/job-request'; 

  constructor(private http: HttpClient) {}

  // Get all Jobs
  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.JobRequestsUrl);
  }
// Get Jobs by Employer ID

getJobsByEmployerId(employerId: string): Observable<Job[]> {
  const url = `http://localhost:3000/job-request/by-employer?employerId=${encodeURIComponent(employerId)}`;
  return this.http.get<Job[]>(url);  // Using Angular's HttpClient
}



  // Get Job by ID
  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.JobRequestsUrl}/${id}`);
  }

  // Save a new Job
  saveJobData(Job: Job): Observable<Job> {
    return this.http.post<Job>(this.JobRequestsUrl, Job, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Update an Job by ID
  updateJob(id: string, updatedJob: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.JobRequestsUrl}/${id}`, updatedJob, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Delete an Job by ID
  deleteJob(id: string): Observable<any> {
    return this.http.delete(`${this.JobRequestsUrl}/${id}`);
  }
}
