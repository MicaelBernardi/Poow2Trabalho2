import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { ClienteComponent } from '../clientes-component/clientes-component';
import { ServicoComponent } from '../servicos-component/servicos-component';
import { FuncionarioComponent } from '../funcionarios-component/funcionarios-component';
import { AgendamentoComponent } from '../agendamentos-component/agendamentos-component';

import { homeGuard } from '../../core/security/home-guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivateChild: [homeGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: DashboardComponent },
      { path: 'cliente', component: ClienteComponent },
      { path: 'servico', component: ServicoComponent },
      { path: 'funcionario', component: FuncionarioComponent },
      { path: 'agendamento', component: AgendamentoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
