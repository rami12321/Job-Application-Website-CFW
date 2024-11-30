// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class YouthServiceService {
//   private apiUrl = 'http://localhost:3000/submit';


//   constructor(private http: HttpClient) {}

//   submitFormData(formData: any) {
//     return this.http.post(this.apiUrl, formData);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouthServiceService {
  private apiUrl = 'http://localhost:3000/youth'; // Base URL for youth-related endpoints

  constructor(private http: HttpClient) {}


  submitFormData(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }


  getAllYouth(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  getYouthById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  updateYouth(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData);
  }


  deleteYouth(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateYouthStatus(id: number, status: string): Observable<any> {
    // Send PATCH request to update the status
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

   checkPersonalRegistrationNumber(personalRegistrationNumber: string): Observable<{ inUse: boolean; message: string }> {
    return this.http.post<{ inUse: boolean; message: string }>(`${this.apiUrl}/check-registration`, {
      personalRegistrationNumber,
    });
  }
}
