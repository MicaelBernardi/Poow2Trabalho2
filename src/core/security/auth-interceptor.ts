import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeção de dependências
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar); // Para dar feedback visual

  const token = authService.getToken();

  // 1. Clona a requisição para adicionar o Token (Sua lógica original mantida)
  let authReq = req;
  if (token && !req.headers.has('Authorization')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Processa a resposta
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // Verifica se o erro é 403 (Forbidden) ou 401 (Unauthorized)
      // Seu log mostrou erro 403 com mensagem "Token expirado."
      if (error.status === 403 || error.status === 401) {

        // Verifica se é realmente expiração (opcional, mas bom se seu backend manda msg)
        // Você pode remover esse 'if' interno se quiser redirecionar em QUALQUER 403
        if (typeof error.error === 'string' && error.error.includes('Token expirado') || error.status === 403) {

          // A) Limpa os dados do usuário
          // O ideal é chamar o logout do seu service para limpar tudo corretamente
          // authService.logout();
          // OU limpar manualmente se o método logout fizer redirect circular:
          localStorage.clear();

          // B) Mostra aviso ao usuário
          snackBar.open('Sessão expirada. Por favor, faça login novamente.', 'Entendi', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['bg-danger', 'text-white'] // Estilo vermelho
          });

          // C) Chuta para o login
          router.navigate(['/login']);
        }
      }

      // Propaga o erro para o console (ou componente) não ficar 'mudo'
      return throwError(() => error);
    })
  );
};
