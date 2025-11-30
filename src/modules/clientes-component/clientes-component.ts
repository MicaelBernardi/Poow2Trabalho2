import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Imports do Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Imports do Projeto
import { ClienteService } from '../../core/services/clientes.service'; // Ajuste o caminho se necessário
import { Cliente } from './cliente.model';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: 'clientes-component.html',
  styleUrls: ['clientes-component.css']
})
export class ClienteComponent implements OnInit {

  clienteForm!: FormGroup;
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // <--- 1. Injetado para corrigir o erro NG0100
  ) {
    this.clienteForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.listar().subscribe({
      next: (dados) => {
        this.clientes = dados;
        // 2. Força o Angular a detectar mudanças e atualizar a tabela imediatamente
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar clientes:', erro);
        this.mostrarMensagem('Erro ao carregar lista de clientes.', true);
      }
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const cliente: Cliente = this.clienteForm.value;

      this.clienteService.salvar(cliente).subscribe({
        next: (resposta) => {
          const msg = cliente.id ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!';
          this.mostrarMensagem(msg);

          this.cancelarEdicao(); // Limpa o form
          this.carregarClientes(); // Recarrega a tabela
        },
        error: (erro) => {
          console.error('Erro ao salvar:', erro);
          this.mostrarMensagem('Erro ao salvar cliente.', true);
        }
      });
    }
  }

  editar(cliente: Cliente) {
    this.clienteForm.patchValue(cliente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir este cliente?')) {
      this.clienteService.excluir(id).subscribe({
        next: () => {
          this.mostrarMensagem('Cliente excluído.');
          this.carregarClientes();
        },
        error: (erro) => {
          console.error('Erro ao excluir:', erro);
          this.mostrarMensagem('Erro ao excluir cliente.', true);
        }
      });
    }
  }

  cancelarEdicao() {
    this.clienteForm.reset();
    this.clienteForm.get('id')?.setValue(null);
  }

  private mostrarMensagem(msg: string, isError: boolean = false) {
    this.snackBar.open(msg, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: isError ? ['bg-danger', 'text-white'] : ['bg-success', 'text-white']
    });
  }
}
