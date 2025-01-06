import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Youth } from '../../Model/Youth';

@Injectable({
  providedIn: 'root',
})
export class YouthServiceService {
  private apiUrl = 'http://localhost:3000/youth';
  private youthDbUrl = 'assets/data/youthdb.json';

  constructor(private http: HttpClient) {}


  submitFormData(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
  updateYouthAppliedJobs(youthId: number, appliedJobs: any): Observable<any> {
    const url = `http://localhost:3000/youth/${youthId}/appliedJob`;
    return this.http.put(url, { appliedJob: appliedJobs });  // Sending the array of applied jobs
  }



  getAllYouth(): Observable<any[]> {
    return this.http.get<any[]>(this.youthDbUrl);
  }


  getYouthById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateYouthExperience(userId: string, experiences: any[]): Observable<any> {
    const url = `${this.apiUrl}/${userId}/experiences`; // Endpoint for updating experiences
    const payload = { experiences }; // Payload only includes the 'experiences' field
    return this.http.put(url, payload); // Make the PUT request
  }

    updateYouthTraining(userId: string, trainings: any[]): Observable<any> {
    const url = `${this.apiUrl}/${userId}/trainings`; // Endpoint for updating training
    const payload = { trainings };  // Payload only includes the 'trainings' field
    return this.http.put(url, payload);  // Make the PUT request
  }
  updateYouth(id: any, updatedData: Partial<Youth>): Observable<Youth> {
    return this.http.put<Youth>(`${this.apiUrl}/${id}`, updatedData);
  }


  deleteCamp(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    const payload = { camp: null }; // Clear the 'camp' field
    return this.http.patch(url, payload); // Use PATCH to update only the 'camp' field
  }

  deleteYouth(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateYouthStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }
  updateYouthCategoryJob(id: number, payload: any): Observable<any> {
    return this.http.patch(`http://localhost:3000/youth/${id}/jobCategory`, payload);
  }
  checkPersonalRegistrationNumber(personalRegistrationNumber: string): Observable<{ inUse: boolean; message: string }> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data) => {
        const isInUse = data.some(entry => entry.personalRegistrationNumber === personalRegistrationNumber);
        return {
          inUse: isInUse,
          message: isInUse ? 'This registration number is already taken.' : ''
        };
      })
    );
  }
  updateYouthNotes(id: number, notes: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/notes`, { notes });
  }

  getYouthNotesById(id: number): Observable<{ notes: string }> {
    return this.http.get<{ notes: string }>(`${this.apiUrl}/${id}/notes`);
  }
  getAppliedJobById(id: number): Observable<{ appliedJobs: { job: string; status: string }[] }> {
    return this.http.get<{ appliedJobs: { job: string; status: string }[] }>(`${this.apiUrl}/${id}/appliedJob`);
  }



  getYouthByJob(job: string): Observable<any> {
    const url = `${this.apiUrl}/appliedJob/${encodeURIComponent(job)}`; // Encode the job name for safe URL usage
    return this.http.get<any>(url); // Adjust the response type if needed
  }

  assignYouthToJob(jobId: string, youthId: string): Observable<any> {
    const url = `${this.apiUrl}/${jobId}/${youthId}`;
    return this.http.post(url, {});
  }
  updateYouthIsEdited(id: number, isEdited: boolean): Observable<any> {
    const url = `${this.apiUrl}/${id}/isEdited`;
    return this.http.patch(url, { isEdited });
  }
}
