import { Injectable } from '@angular/core';
import { BehaviorSubject, asapScheduler, observeOn } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Carregando...');

  // Entrega adiada para logo após a renderização atual: as telas chamam show() no ngOnInit,
  // e mudar o overlay nesse instante causa o erro NG0100 no Angular.
  loading$ = this.loadingSubject.pipe(observeOn(asapScheduler));
  message$ = this.messageSubject.pipe(observeOn(asapScheduler));

  show(message = 'Carregando...'): void {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }
}
