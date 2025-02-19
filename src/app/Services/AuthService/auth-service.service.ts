import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private youthUrl = 'http://localhost:3000/youth'; // Youth endpoint
  private employerUrl = 'http://localhost:3000/employer/employer'; // Employer endpoint
  private adminUrl = 'http://localhost:3000/admin'; // Admin endpoint

  constructor(private http: HttpClient) {}
  login(username: string, password: string, role: string): Observable<any> {
    let loginUrl = '';
  
    if (role.toLowerCase() === 'employer') {
      loginUrl = this.employerUrl;
    } else if (role.toLowerCase() === 'youth') {
      loginUrl = this.youthUrl;
    } else if (role.toLowerCase() === 'admin') {
      loginUrl = this.adminUrl;
    } else {
      loginUrl = this.youthUrl;
    }
  
    return this.http.get<any[]>(loginUrl).pipe(
      map((users) => {
        const user = users.find((u) => {
          const userIdentifier = u.personalEmail || u.username;
          return (
            userIdentifier?.toLowerCase() === username.toLowerCase() &&
            u.password === password
          );
        });
  
        if (user) {
          const userRole = user.role || role; // Ensure role is not undefined
          localStorage.setItem('authenticated', 'true');
          localStorage.setItem('role', userRole);
          localStorage.setItem('userId', user.id.toString());
  
          if (userRole === 'Employer') {
            localStorage.setItem('firstName', user.fullNameEnglish);
          } else if (userRole === 'Youth') {
            localStorage.setItem('firstName', user.firstNameEn || '');
            localStorage.setItem('lastName', user.lastNameEn || '');
          }
  
          return { success: true, role: userRole, admin: user };
        } else {
          return { success: false, message: `Invalid credentials for ${role}` };
        }
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return of({ success: false, message: 'An error occurred during login' });
      })
    );
  }
  
  // Check if an admin exists by email and that they have no password yet.
  checkAdminEmail(email: string): Observable<any> {
    return this.http.get<any[]>(this.adminUrl).pipe(
      map((admins) => {
        const admin = admins.find(
          (a) => a.personalEmail.toLowerCase() === email.toLowerCase()
        );
        if (admin) {
          if (!admin.password || admin.password === '') {
            return { exists: true, admin };
          } else {
            return { exists: true, admin, alreadyHasPassword: true };
          }
        }
        return { exists: false };
      }),
      catchError((error) => {
        console.error('Error checking admin email:', error);
        return of({ exists: false, message: 'Error checking admin email' });
      })
    );
  }

  // Update the admin record with a new password.
  setAdminPassword(adminId: string, password: string): Observable<any> {
    const url = `${this.adminUrl}/${adminId}`;
    const updateData = { password };
    return this.http.put(url, updateData).pipe(
      map((response) => {
        return { success: true, response };
      }),
      catchError((error) => {
        console.error('Error setting admin password:', error);
        return of({ success: false, message: 'Error setting admin password' });
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
