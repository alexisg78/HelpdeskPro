import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'appLogin-auth',
  templateUrl: './login.component.html',
  styles: ``,
  standalone: false
})
export class AuthLoginComponent {

  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    // Convertir tanto el usuario como la contraseña a mayúsculas
    const loginData = {
      username: username.toUpperCase(),
      password: password.toUpperCase()
    };

    //const credenciales = this.loginForm.value;

    this.authService.postLogin(loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Guardar token
        this.router.navigate(['/home']); // Redirigir a la página principal
      },
      error: (error) => console.error('Error en login:', error)
    });
  }
}
