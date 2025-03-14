import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceRecord } from '../../Model/Attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://localhost:3000/attendance';

  constructor(private http: HttpClient) {}

  createAttendance(attendance: AttendanceRecord): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(this.baseUrl, attendance);
  }

  updateAttendance(id: string, attendance: Partial<AttendanceRecord>): Observable<AttendanceRecord> {
    return this.http.put<AttendanceRecord>(`${this.baseUrl}/${id}`, attendance);
  }

  getAttendanceById(id: string): Observable<AttendanceRecord> {
    return this.http.get<AttendanceRecord>(`${this.baseUrl}/${id}`);
  }
// signature.service.ts
uploadSignature(signatureData: string): Observable<{ filePath: string }> {
  // Here, signatureData should be a data URL (e.g., "data:image/png;base64,...")
  return this.http.post<{ filePath: string }>(
    'http://localhost:3000/uploadSignature', 
    { signatureData }
  );
}

  // New method to fetch an attendance record by youth and jobRequestId
  getAttendanceByYouthAndJob(youthId: string, jobRequestId: string): Observable<AttendanceRecord> {
    return this.http.get<AttendanceRecord>(`${this.baseUrl}/byYouthAndJob?youthId=${youthId}&jobRequestId=${jobRequestId}`);
  }
}
