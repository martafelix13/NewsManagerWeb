import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private loginService = inject(LoginService);


  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  loading: boolean = false;

  login(): void {
    this.loading = true;
    const user$ = this.loginService.login(
      this.loginForm.value.username ?? '',
      this.loginForm.value.password ?? ''
    );
    user$.subscribe({
      next: () => {
        this.loginForm.setValue({
          username: '',
          password: ''
        })
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          this.loginForm.patchValue({ password: '' });
          this.loginForm.setErrors({
            wrongCredentials: true,
          });
        }
        this.loading = false;
      },
    });
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  logout(): void {
    this.loginService.logout();
  }

  getUser(): User | null {
    return this.loginService.getUser();
  }
}
