import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuncionarioService } from '../../core/services/funcionarios.service';
import { Funcionario } from './funcionario.model';

@Component({
  selector: 'app-funcionario',
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
  templateUrl: 'funcionarios-component.html',
  styleUrls: ['funcionarios-component.css']
})
export class FuncionarioComponent implements OnInit {

  funcionarioForm!: FormGroup;
  funcionarios: Funcionario[] = [];
  displayedColumns: string[] = ['nome', 'email', 'acoes'];
  hideSenha = true;

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.funcionarioForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  get nome() { return this.funcionarioForm.get('nome')!; }
  get email() { return this.funcionarioForm.get('email')!; }
  get senha() { return this.funcionarioForm.get('senha')!; }

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios() {
    this.funcionarioService.listar().subscribe({
      next: (dados) => {
        this.funcionarios = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error(erro);
        this.mostrarMensagem('Erro ao carregar funcionários.', true);
      }
    });
  }

  onSubmit() {
    if (this.funcionarioForm.valid) {
      const func: Funcionario = this.funcionarioForm.value;

      this.funcionarioService.salvar(func).subscribe({
        next: () => {
          const msg = func.id ? 'Funcionário atualizado!' : 'Funcionário cadastrado!';
          this.mostrarMensagem(msg);
          this.cancelarEdicao();
          this.carregarFuncionarios();
        },
        error: (erro) => {
          console.error(erro);
          this.mostrarMensagem('Erro ao salvar.', true);
        }
      });
    }
  }

  editar(func: Funcionario) {
    this.funcionarioForm.patchValue(func);
    this.funcionarioForm.get('senha')?.setValue('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir este funcionário?')) {
      this.funcionarioService.excluir(id).subscribe({
        next: () => {
          this.mostrarMensagem('Funcionário excluído.');
          this.carregarFuncionarios();
        },
        error: () => this.mostrarMensagem('Erro ao excluir.', true)
      });
    }
  }

  cancelarEdicao() {
    this.funcionarioForm.reset();
    this.funcionarioForm.get('id')?.setValue(null);
    this.hideSenha = true;
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
