import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-home-component',
  imports: [
    MatIcon,
    MatToolbar,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    MatButton
  ],
  templateUrl: 'home-component.html',
  styleUrl: 'home-component.css',
})
export class HomeComponent {
  constructor ( private authService : AuthService ) {}

  protected logout () {
    this.authService.logout();
  }
}

