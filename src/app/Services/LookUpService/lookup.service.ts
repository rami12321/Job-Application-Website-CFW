import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LookupService {

  private lookupUrl = 'assets/data/lookup.json';  // Relative path to the JSON file
  private areaData: any = {};

  constructor(private http: HttpClient) {}

  getLookupData(): Observable<any> {
    return this.http.get<any>(this.lookupUrl);
  }
  getMajors(): Observable<string[]> {
    return this.http.get<any>('assets/data/lookup.json').pipe(map((data) => data.majors));
  }
  getJobDescription(jobTitle: string): Observable<string[]> {
    return this.http.get<any>(this.lookupUrl).pipe(
      map(data => {
        const job = data.jobs[jobTitle];
        return job ? job.description : [];
      })
    );
  }
  getJobCategories(): Observable<string[]> {
    return this.http.get<any>('assets/data/lookup.json').pipe(map((data) => data.jobCategories));
  }
  fetchAreaData(): Observable<any> {
    return this.http.get<any>('assets/data/lookup.json');
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

}
