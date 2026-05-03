import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-tabs',
  templateUrl: './auth-tabs.component.html',
  styleUrls: ['./auth-tabs.component.scss'],
  standalone: false,
})
export class AuthTabsComponent {
  tab: 'login' | 'register' = 'login';
}
