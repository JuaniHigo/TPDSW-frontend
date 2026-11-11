import { createContext } from 'react';
import type { User } from '../types/User';
export type { User };
export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
