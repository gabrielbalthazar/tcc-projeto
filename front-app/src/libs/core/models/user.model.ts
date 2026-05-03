export type UserRole = 'editor' | 'cliente';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
  criadoEm: Date;
}

export interface LoginPayload {
  email: string;
  senha: string;
  lembrarMe?: boolean;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  tipo: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
