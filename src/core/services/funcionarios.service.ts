import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../../modules/funcionarios-component/funcionario.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrl = `${environment.apiUrl}/funcionario`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl);
  }

  salvar(funcionario: Funcionario): Observable<Funcionario> {
    if (funcionario.id) {
      return this.http.put<Funcionario>(`${this.apiUrl}/${funcionario.id}`, funcionario);
    }
    return this.http.post<Funcionario>(this.apiUrl, funcionario);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`);
  }
}
