import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouthServiceService {
  private apiUrl = 'http://localhost:3000/submit';


  constructor(private http: HttpClient) {}

  submitFormData(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }
}

