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

    const credenciales = this.loginForm.value;
    console.log('credenciales: ', credenciales)
    this.authService.postLogin(credenciales).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('token', response.token); // Guardar token
        this.router.navigate(['/home']); // Redirigir a la página principal
      },
      error: (error) => console.error('Error en login:', error)
    });
  }
}
