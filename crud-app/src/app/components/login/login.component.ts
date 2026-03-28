import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onLogin() {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/crud']);
      },
      error: (err: any) => {
        this.error = 'Invalid username or password';
        this.isLoading = false;
      }
    });
  }
}
