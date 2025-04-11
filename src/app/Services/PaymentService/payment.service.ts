import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/payments'; // Corrected URL

  constructor(private http: HttpClient) {}

  // Method to process a payment
  generatePayment(youthId: number, jobRequestId: number): Observable<any> {
    const url = `${this.apiUrl}/generate-payment`;
    const body = { youthId, jobRequestId };
    return this.http.post(url, body);
  }

  /**
   * Fetch payment records for a specific youth.
   * @param youthId - The ID of the youth.
   * @returns An observable with the list of payment records.
   */
  getPaymentsByYouth(youthId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/${youthId}`);
  }
// In payment.service.ts
generatePaymentsForMultipleYouth(youthJobPairs: {youthId: string, jobRequestId: string}[]): Observable<any> {
  console.log('Final payload being sent:', youthJobPairs); // Debug log
  return this.http.post(`${this.apiUrl}/generate-multiple`, youthJobPairs).pipe(
    catchError(error => {
      console.error('Payment generation error:', error);
      return throwError(() => error);
    })
  );
}
 // In payment.service.ts
getPaymentsByYouthIds(youthIds: string[]): Observable<any[]> {
  const params = new HttpParams().set('youthIds', youthIds.join(','));
  return this.http.get<any[]>(`${this.apiUrl}/by-youths`, { params }).pipe(
    catchError(error => {
      console.error('Error checking existing payments:', error);
      return of([]); // Return empty array on error
    })
  );
}
getPaymentHistory(
  filters: {
    youthId?: string;
    employerId?: string;
    jobRequestId?: string;
  },
  pagination: {
    page?: number;
    limit?: number;
  } = {}
): Observable<any> {
  let params = new HttpParams();

  // Add filters
  if (filters.youthId) params = params.set('youthId', filters.youthId);
  if (filters.employerId) params = params.set('employerId', filters.employerId);
  if (filters.jobRequestId) params = params.set('jobRequestId', filters.jobRequestId);

  // Add pagination
  params = params.set('page', pagination.page?.toString() || '1');
  params = params.set('limit', pagination.limit?.toString() || '10');

  return this.http.get<any>(`${this.apiUrl}/history`, { params }).pipe(
    catchError(error => {
      console.error('Error fetching payment history:', error);
      return throwError(() => error);
    })
  );
}

getPaymentsByYouthId(youthId: string): Observable<any[]> {
  return this.getPaymentHistory({ youthId }, { limit: 100 }).pipe(
    map(response => response.payments)
  );
}


}
