import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employer } from '../../Model/Employer';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  private employerDbUrl = 'http://localhost:3000/employer/employer'; // Ensure the backend is running at this URL

  constructor(private http: HttpClient) {}

  // Get all employers
  getAllEmployers(): Observable<Employer[]> {
    return this.http.get<Employer[]>(this.employerDbUrl);
  }

  // Get employer by ID
  getEmployerById(id: string): Observable<Employer> {
    return this.http.get<Employer>(`${this.employerDbUrl}/${id}`);
  }

  // Save a new employer
  saveEmployerData(employer: Employer): Observable<Employer> {
    return this.http.post<Employer>(this.employerDbUrl, employer, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  uploadProfileImage(employerId: string, payload: { image: string }): Observable<any> {
    return this.http.post<any>(`${this.employerDbUrl}/${employerId}/upload-profile-image`, payload);
  }


  // Update an employer by ID
  updateEmployer(id: string, updatedEmployer: Partial<Employer>): Observable<Employer> {
    return this.http.put<Employer>(`${this.employerDbUrl}/${id}`, updatedEmployer, {
    });
  }


  // Delete an employer by ID
  deleteEmployer(id: string): Observable<any> {
    return this.http.delete(`${this.employerDbUrl}/${id}`);
  }
  assignYouthToEmployer(employerId: string, youthId: string, name: string): Observable<any> {
    const url = `${this.employerDbUrl}/${employerId}/assign/${youthId}`;
    return this.http.post(url, { name }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateActiveStatus(employerId: string, isActive: boolean): Observable<Employer> {
    const url = `${this.employerDbUrl}/${employerId}/updateStatus`;
    return this.http.put<Employer>(url, { isActive });
  }

  // Get organization name by employer ID
  getOrganizationNameById(id: string): Observable<{ organizationName: string }> {
    const url = `${this.employerDbUrl}/${id}/organizationName`;
    return this.http.get<{ organizationName: string }>(url);
  }
}
