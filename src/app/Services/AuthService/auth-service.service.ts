import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = 'assets/users.json'; // Path to JSON file

  constructor(private http: HttpClient) {}

  login(userName: string, password: string, role: string): Observable<any> {
    return this.http.get<any[]>(this.usersUrl).pipe(
      map(users => {

        // Find the user matching both userName and password and check the role
        const user = users.find(
          u => u.userName === userName && u.password === password && u.role === role
        );
        if (user) {
          return { success: true, role: user.role, id: user.id };
        } else {
          return { success: false, message: 'Invalid credentials or role' };
        }
      })
    );
  }
}
