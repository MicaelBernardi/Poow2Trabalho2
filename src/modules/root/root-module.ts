import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RootComponent} from './root-component';
import {LoginComponent} from './login-component/login-component';
import {RootRoutingModule} from './root-routing-module';


@NgModule({
  imports: [
    CommonModule,
    RootRoutingModule,
    RootComponent,
    LoginComponent
  ]
})
export class RootModule {}
