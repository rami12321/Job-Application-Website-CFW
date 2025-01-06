import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private youthUrl = 'http://localhost:3000/youth'; // Path to Youth JSON data
  private employerUrl = 'http://localhost:3000/employer/employer'; // Path to Employer JSON data

  constructor(private http: HttpClient) {}

  login(username: string, password: string, role: string): Observable<any> {
    let loginUrl = '';

    if (role.toLowerCase() === 'employer') {
      loginUrl = this.employerUrl;
    } else if (role.toLowerCase() === 'youth') {
      loginUrl = this.youthUrl;
    } else {
      // Invalid role
      role = 'admin';    }

    return this.http.get<any[]>(loginUrl).pipe(
      map((users) => {
        console.log(`Fetched users from ${loginUrl}:`, users); // Debugging

        // Find the user matching both username and password
        const user = users.find(
          (u) =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
        );

        if (user) {
          // Save authentication details in localStorage
          if(user.role=='Employer'){
          localStorage.setItem('firstName', user.fullNameEnglish);
          localStorage.setItem('role', user.role);
          }else{

            localStorage.setItem('firstName', user.firstNameEn); // Store first name
            localStorage.setItem('lastName', user.lastNameEn); // Store last name
          }
          localStorage.setItem('authenticated', 'true'); // Store authentication status
          localStorage.setItem('role', user.role); // Store role
          localStorage.setItem('status', user.status); // Store role
          localStorage.setItem('notes', user.notes); // Store role
          localStorage.setItem('userId', user.id.toString()); // Store user ID

          // Return success response
          return { success: true, role: user.role, id: user.id };
        } else {
          return { success: false, message: `Invalid credentials for this ${role}` };
        }
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return of({ success: false, message: 'An error occurred during login' });
      })
    );
  }

  
  logout(): void {
    // Clear all authentication-related data from localStorage
    localStorage.removeItem('authenticated');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('role');
    localStorage.removeItem('status');
    localStorage.removeItem('notes');
    localStorage.removeItem('userId');

  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authenticated') === 'true';
  }
}
