import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouthServiceService {
  private areaData: any = {};
  private apiUrl = 'http://localhost:3000/submit'; 


  constructor(private http: HttpClient) {}
  
  submitFormData(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }
  fetchAreaData(): Observable<any> {
    return this.http.get<any>('assets/lookup.json');
  }

  setAreaData(data: any): void {
    this.areaData = data;
  }

  getAreaOptions(): string[] {
    return Object.keys(this.areaData);
  }

  getAreaData(): any {
    return this.areaData;
  }
  getMajors(): Observable<string[]> {
    return this.http.get<any>('assets/lookup.json').pipe(map((data) => data.majors));
  }
  
}

