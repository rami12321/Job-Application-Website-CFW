import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Job } from '../../Model/JobDetails';
import { AssignedYouth } from '../../Model/assignedYouth';

@Injectable({
  providedIn: 'root',
})
export class JobRequestService {
  private JobRequestsUrl = 'http://localhost:3000/job-request';

  constructor(private http: HttpClient) {}

  // Get all Jobs
  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.JobRequestsUrl);
  }
  // Get all Job Requests
getAllJobRequests(): Observable<Job[]> {
  return this.http.get<Job[]>(this.JobRequestsUrl);
}

  // Get Jobs by Employer ID
  getJobsByEmployerId(employerId: string): Observable<Job[]> {
    const url = `${this.JobRequestsUrl}/by-employer/${employerId}`;
    return this.http.get<Job[]>(url); // Using Angular's HttpClient
  }
  // Get Job by ID
  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.JobRequestsUrl}/${id}`);
  }

  // Save a new Job
  saveJobData(Job: Job): Observable<Job> {
    return this.http.post<Job>(this.JobRequestsUrl, Job, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update an Job by ID
  updateJob(id: string, updatedJob: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.JobRequestsUrl}/${id}`, updatedJob, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Delete an Job by ID
  deleteJob(id: string): Observable<any> {
    return this.http.delete(`${this.JobRequestsUrl}/${id}`);
  }
  assignYouthToJobRequest(jobId: string, youthId: string): Observable<any> {
    const url = `${this.JobRequestsUrl}/${jobId}/youths/${youthId}`;
    return this.http.put(url, {}, { headers: { 'Content-Type': 'application/json' } });
  }
  updateJobRequestStatus(id: string, status: string): Observable<any> {
    const url = `${this.JobRequestsUrl}/${id}/status`;
    return this.http.put(
      url,
      { status },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
getAssignedYouthsByJobId(id: any): Observable<AssignedYouth[]> {
  const url = `${this.JobRequestsUrl}/assigned-youths/${id}`;
  return this.http.get<AssignedYouth[]>(url); 
}



 // Unassign Youth from Job Request
 unassignYouthFromJobRequest(jobId: string, youthId: any): Observable<any> {
  const url = `${this.JobRequestsUrl}/${jobId}/unassignYouth/${youthId}`;
  return this.http.delete(url, { headers: { 'Content-Type': 'application/json' } });
}
}

