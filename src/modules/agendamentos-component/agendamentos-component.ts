import { Component, OnInit, ChangeDetectorRef, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AgendamentoService } from '../../core/services/agendamentos.service';
import { ClienteService } from '../../core/services/clientes.service';
import { FuncionarioService } from '../../core/services/funcionarios.service';
import { ServicoService } from '../../core/services/servicos.service';
import { Agendamento } from './agendamento.model';
import { Cliente } from '../clientes-component/cliente.model';
import { Funcionario } from '../funcionarios-component/funcionario.model';
import { Servico } from '../servicos-component/servico.model';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'DD/MM/YYYY') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return date.toDateString();
  }
}

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatTableModule, MatIconModule, MatSelectModule, MatSnackBarModule, MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  templateUrl: 'agendamentos-component.html',
  styleUrls: ['agendamentos-component.css']
})
export class AgendamentoComponent implements OnInit {
  agendamentoForm!: FormGroup;
  agendamentos: Agendamento[] = [];
  clientes: Cliente[] = [];
  funcionarios: Funcionario[] = [];
  servicos: Servico[] = [];
  displayedColumns: string[] = ['data', 'cliente', 'funcionario', 'servico', 'status', 'acoes'];
  statusFiltro: string = '';

  constructor(
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private servicoService: ServicoService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.agendamentoForm = this.fb.group({
      id: [null],
      data: ['', Validators.required],
      status: ['Agendado'],
      cliente: ['', Validators.required],
      funcionario: ['', Validators.required],
      servico: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarDadosAuxiliares();
    this.filtrar(this.statusFiltro);
  }

  carregarDadosAuxiliares() {
    this.clienteService.listar().subscribe(d => setTimeout(() => { this.clientes = d; this.cdr.detectChanges(); }, 0));
    this.funcionarioService.listar().subscribe(d => setTimeout(() => { this.funcionarios = d; this.cdr.detectChanges(); }, 0));
    this.servicoService.listar().subscribe(d => setTimeout(() => { this.servicos = d; this.cdr.detectChanges(); }, 0));
  }

  filtrar(status: string) {
    this.statusFiltro = status;
    this.agendamentoService.listar(status).subscribe({
      next: (dados) => {
        setTimeout(() => {
          this.agendamentos = dados;
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => this.mostrarMensagem('Erro ao carregar agendamentos.', true)
    });
  }

  onSubmit() {
    if (this.agendamentoForm.valid) {
      const agendamento = { ...this.agendamentoForm.value };

      if (agendamento.data instanceof Date) {
        const d = agendamento.data;
        const ano = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        agendamento.data = `${ano}-${mes}-${dia}`;
      }

      this.agendamentoService.salvar(agendamento).subscribe({
        next: () => {
          const msg = agendamento.id ? 'Agendamento atualizado!' : 'Agendamento criado!';
          this.mostrarMensagem(msg);
          this.cancelarEdicao();
          this.filtrar(this.statusFiltro);
        },
        error: () => this.mostrarMensagem('Erro ao salvar.', true)
      });
    }
  }

  editar(agendamento: Agendamento) {
    const dadosParaEditar: any = { ...agendamento };

    if (dadosParaEditar.data) {
      const dataString = dadosParaEditar.data.toString().split('T')[0];
      const [ano, mes, dia] = dataString.split('-');
      dadosParaEditar.data = new Date(+ano, +mes - 1, +dia);
    }

    this.agendamentoForm.patchValue(dadosParaEditar);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluir(id: number) {
    if (confirm('Deseja excluir este agendamento?')) {
      this.agendamentoService.excluir(id).subscribe(() => {
        this.mostrarMensagem('Agendamento excluído.');
        this.filtrar(this.statusFiltro);
      });
    }
  }

  finalizar(id: number) {
    if (confirm('Deseja finalizar este atendimento?')) {
      this.agendamentoService.finalizar(id).subscribe(() => {
        this.mostrarMensagem('Agendamento finalizado com sucesso!');
        this.filtrar(this.statusFiltro);
      });
    }
  }

  cancelarEdicao() {
    this.agendamentoForm.reset();
    this.agendamentoForm.get('id')?.setValue(null);
    this.agendamentoForm.get('status')?.setValue('Agendado');
  }

  compareById(o1: any, o2: any): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  private mostrarMensagem(msg: string, isError: boolean = false) {
    this.snackBar.open(msg, 'Fechar', {
      duration: 5000, horizontalPosition: 'end', verticalPosition: 'bottom',
      panelClass: isError ? ['bg-danger', 'text-white'] : ['bg-success', 'text-white']
    });
  }
}
