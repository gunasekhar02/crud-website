import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.error = '';
    this.success = '';

    if (!this.username.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.error = 'All fields are required.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to login ...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Registration failed. Try again.';
        this.isLoading = false;
      }
    });
  }
}
