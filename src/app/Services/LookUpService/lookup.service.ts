import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private lookupUrl = 'assets/lookup.json'; // Update this path if needed

  constructor(private http: HttpClient) {}

  getLookupData(): Observable<any> {
    return this.http.get<any>(this.lookupUrl);
  }
}
