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
import { ServicoService } from '../../core/services/servicos.service';
import { Servico } from './servico.model';

@Component({
  selector: 'app-servico',
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
  templateUrl: 'servicos-component.html',
  styleUrls: ['servicos-component.css']
})
export class ServicoComponent implements OnInit {

  servicoForm!: FormGroup;
  servicos: Servico[] = [];
  displayedColumns: string[] = ['descricao', 'valor', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private servicoService: ServicoService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.servicoForm = this.fb.group({
      id: [null],
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get descricao() { return this.servicoForm.get('descricao')!; }
  get valor() { return this.servicoForm.get('valor')!; }

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos() {
    this.servicoService.listar().subscribe({
      next: (dados) => {
        setTimeout(() => {
          this.servicos = dados;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (erro) => {
        console.error(erro);
        this.mostrarMensagem('Erro ao carregar serviços.', true);
      }
    });
  }

  onSubmit() {
    if (this.servicoForm.valid) {
      const servico: Servico = this.servicoForm.value;

      this.servicoService.salvar(servico).subscribe({
        next: () => {
          const msg = servico.id ? 'Serviço atualizado!' : 'Serviço cadastrado!';
          this.mostrarMensagem(msg);
          this.cancelarEdicao();
          this.carregarServicos();
        },
        error: (erro) => {
          console.error(erro);
          this.mostrarMensagem('Erro ao salvar.', true);
        }
      });
    }
  }

  editar(servico: Servico) {
    this.servicoForm.patchValue(servico);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir este serviço?')) {
      this.servicoService.excluir(id).subscribe({
        next: () => {
          this.mostrarMensagem('Serviço excluído.');
          this.carregarServicos();
        },
        error: () => this.mostrarMensagem('Erro ao excluir.', true)
      });
    }
  }

  cancelarEdicao() {
    this.servicoForm.reset();
    this.servicoForm.get('id')?.setValue(null);
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
