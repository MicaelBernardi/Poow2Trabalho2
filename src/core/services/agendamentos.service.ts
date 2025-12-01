import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../../modules/agendamentos-component/agendamento.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = `${environment.apiUrl}/agendamento`;

  constructor(private http: HttpClient) {}

  listar(status?: string): Observable<Agendamento[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Agendamento[]>(this.apiUrl, { params });
  }

  salvar(agendamento: Agendamento): Observable<Agendamento> {
    if (agendamento.id) {
      return this.http.put<Agendamento>(`${this.apiUrl}/${agendamento.id}`, agendamento);
    }
    return this.http.post<Agendamento>(this.apiUrl, agendamento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  finalizar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/finalizar`, {});
  }
}
