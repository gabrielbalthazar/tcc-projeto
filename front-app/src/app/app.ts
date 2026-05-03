import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '../libs/shared/components/services/loading.service';
import { LoadingComponent } from '../libs/shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoadingComponent,
    CommonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front-app');
  constructor(
    public loadingService: LoadingService) {}
}
