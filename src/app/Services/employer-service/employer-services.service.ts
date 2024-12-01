import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private employerDbUrl = 'assets/data/youthdb.json';
  constructor(private http: HttpClient) {}
  checkemployerid(id: string): Observable<{ inUse: boolean; message: string }> {
    return this.http.get<any[]>(this.employerDbUrl).pipe(
      map((data) => {
        const isInUse = data.some(entry => entry.id === id);
        return {
          inUse: isInUse,
          message: isInUse ? 'This ID number is already taken.' : ''
        };
      })
    );
  }

}
