import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../../Model/Admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:3000/admin'; // Corrected URL

  constructor(private http: HttpClient) {}

  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.baseUrl}`, admin);
  }

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.baseUrl}`);
  }

  updateAdminStatus(adminId: string, status: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/${adminId}/status`, { active: status });
  }

  deleteAdmin(adminId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${adminId}`);
  }
}
