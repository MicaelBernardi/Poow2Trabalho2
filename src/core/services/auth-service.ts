import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(email: string, senha: string) {
    return this.httpClient.post<any>(`${environment.apiUrl}/login`, { email, senha });
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    // ... lógica de decodificar token se necessário
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
