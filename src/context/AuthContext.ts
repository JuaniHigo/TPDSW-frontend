import { createContext } from "react";

// Tipo de usuario según tu entidad
export type User = {
  idUsuario: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string; // "admin" o "user"
};

// Tipo del contexto
export type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (newToken: string, userData: User) => void;
  logout: () => void;
};

// Contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
