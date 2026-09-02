export type UserRole = 'editor' | 'cliente';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
  criadoEm: Date;
  cargo?: string;
  telefone?: string;
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

export interface UpdateUserPayload {
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
