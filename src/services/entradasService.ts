import api from './api';
import type { EntradaComprada } from '../types/api';
export type { EntradaComprada };
export async function getMisEntradas(): Promise<EntradaComprada[]> {
  return (await api.get<EntradaComprada[]>('/users/me/entradas')).data;
}
