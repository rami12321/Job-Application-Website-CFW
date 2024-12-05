import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class VerificationCodeService {
  private apiUrl = 'http://localhost:3000/api/verificationCode'; // Correct API URL

  constructor(private http: HttpClient) {}

  // Generate a new verification code
  generateCode(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/verificationCode', {});
  }
  

  // Get all verification codes (for validation purposes)
  getCodes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/verificationCodes');
  }
  // Delete a verification code (after it's used)
  deleteCode(code: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${code}`);
  }
  
  
  
}
