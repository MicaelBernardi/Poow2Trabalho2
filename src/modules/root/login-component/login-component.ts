import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.html',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatCardActions,
    MatError,
    MatLabel,
    RouterLink,
    MatButton,
    MatInput
  ],
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  protected onSubmit() {
    if (this.form.valid) {
      const { email, senha } = this.form.value;

      this.authService.login(email, senha).subscribe({
        next: (response) => {
          console.log('Login com sucesso, token', response.token);
          this.authService.setToken(response.token);
          this.router.navigate(['/home']); // Redireciona para /home
        },
        error: (err) => {
          console.log('Login falhou', err);
        }
      });
    }
  }
}
