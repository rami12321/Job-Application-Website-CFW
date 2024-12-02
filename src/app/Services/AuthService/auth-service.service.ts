import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = 'http://localhost:3000/youth'; // Path to JSON file

  constructor(private http: HttpClient) {}

  login(username: string, password: string, role: string): Observable<any> {
    return this.http.get<any[]>(this.usersUrl).pipe(
      map((users) => {
        // Find the user matching both username and password and check the role
        const user = users.find(
          (u) =>
            u.username === username &&
            u.password === password &&
            u.role === role
        );
        if (user) {
          // Save authentication details in localStorage
          localStorage.setItem('authenticated', 'true'); // Store authentication status
          localStorage.setItem('userRole', user.role); // Store the role (Employer/Youth)

          // Return success response
          return { success: true, role: user.role, id: user.id };
        } else {
          return { success: false, message: 'Invalid credentials' };
        }
      })
    );
  }
}
