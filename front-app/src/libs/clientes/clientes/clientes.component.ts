import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../core/models/cliente.model';
import { ClientesService } from '../services/clientes.service';
import { LoadingService } from '../../shared/components/services/loading.service';
import { ClienteModalComponent, ClienteModalData } from '../components/cliente-modal/cliente-modal.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: false,
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  busca = '';

  constructor(
    private clientesService: ClientesService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.loadingService.show('Carregando clientes...');
    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.aplicarFiltro();
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
      }
    });
  }

  aplicarFiltro(): void {
    const termo = this.busca.trim().toLowerCase();

    this.clientesFiltrados = !termo
      ? this.clientes
      : this.clientes.filter(cliente =>
          [cliente.nome, cliente.empresa, cliente.email]
            .some(campo => campo?.toLowerCase().includes(termo))
        );
  }

  onBusca(event: Event): void {
    this.busca = (event.target as HTMLInputElement).value;
    this.aplicarFiltro();
  }

  iniciais(nome: string): string {
    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(parte => parte[0])
      .join('')
      .toUpperCase();
  }

  novoCliente(): void {
    this.abrirModal({});
  }

  editarCliente(cliente: Cliente): void {
    this.abrirModal({ cliente });
  }

  private abrirModal(data: ClienteModalData): void {
    const dialogRef = this.dialog.open(ClienteModalComponent, {
      width: '480px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: 'first-tabbable',
      panelClass: 'app-dialog-panel',
      data,
    });

    // O modal só fecha com um cliente quando o back-end confirmou o salvamento.
    dialogRef.afterClosed().subscribe((salvo: Cliente | undefined) => {
      if (salvo) this.carregarClientes();
    });
  }
}
