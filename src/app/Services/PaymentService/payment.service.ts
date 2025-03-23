import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/admin'; // Corrected URL

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
    const url = `${this.apiUrl}/payments/${youthId}`;
    return this.http.get(url);
  }

}