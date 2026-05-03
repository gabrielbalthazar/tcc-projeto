import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Carregando...');

  loading$ = this.loadingSubject.asObservable();
  message$ = this.messageSubject.asObservable();

  show(message = 'Carregando...'): void {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }
}
