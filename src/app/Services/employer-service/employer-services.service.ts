import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Employer } from '../../Model/Employer';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  private employerDbUrl = 'http://localhost:3000/api/employer'; // Ensure this matches backend routes
  constructor(private http: HttpClient) {}

  saveEmployerData(employer: Employer): Observable<any> {
    return this.http.post(this.employerDbUrl, employer, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  


}
