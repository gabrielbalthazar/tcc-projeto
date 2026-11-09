import type { UserRole } from './user.model';

export interface UsuarioResumo {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
}
