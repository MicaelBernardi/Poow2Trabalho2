import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-root-component',
  imports: [
    RouterOutlet,
    MatCardContent,
    MatCardTitle,
    MatCard,
    MatCardHeader
  ],
  templateUrl: './root-component.html',
  styleUrl: './root-component.css',
})
export class RootComponent {

}
