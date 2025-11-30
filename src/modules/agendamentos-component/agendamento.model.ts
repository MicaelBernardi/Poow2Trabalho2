import { Cliente } from '../clientes-component/cliente.model';
import { Funcionario } from '../funcionarios-component/funcionario.model';
import { Servico } from '../servicos-component/servico.model';

export interface Agendamento {
  id?: number;
  data: string;
  status: string;

  cliente: Cliente;
  funcionario: Funcionario;
  servico: Servico;
}
