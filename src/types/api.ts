import type { User } from './User';
export type { User };
export interface Page<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface Club {
  idClub: number;
  nombre: string;
  logoUrl: string | null;
}
export interface Estadio {
  idEstadio: number;
  nombre: string;
  calle: string | null;
  numero: string | null;
  ciudad: string | null;
}
export interface Sector {
  idSector: number;
  fkIdEstadio: number;
  nombreSector: string;
  capacidad: number | null;
}
export interface Evento {
  idEvento: number;
  fkIdClubLocal: number;
  fkIdClubVisitante: number;
  fkIdEstadio: number;
  fechaHora: string;
  torneo: string | null;
  estado: string;
  soloPublicoLocal: boolean;
  nombreLocal: string;
  nombreVisitante: string;
  logoLocal: string | null;
  logoVisitante: string | null;
  nombreEstadio: string;
}
export interface Oferta {
  idSector: number;
  nombreSector: string;
  capacidad: number | null;
  precio: string;
  disponibles: number;
}
export interface EntradaComprada {
  esDemo: boolean;
  idEntrada: number;
  codigoQr: string;
  fechaCompra?: string;
  idEvento: number;
  fechaHora: string;
  torneo?: string;
  nombreLocal: string;
  logoLocal?: string;
  nombreVisitante: string;
  logoVisitante?: string;
  nombreSector: string;
}
export interface Compra {
  provider: PaymentProvider | null;
  idCompra: number;
  estado: string;
  montoTotal: string;
  moneda: string;
  expiresAt?: string;
  quantity?: number;
  snapshot?: {
    nombreLocal: string;
    nombreVisitante: string;
    nombreSector: string;
    fechaHora: string;
  };
}
export type PaymentProvider = 'demo' | 'mercadopago';
export type DemoResult = 'approved' | 'rejected' | 'pending';
export interface PaymentConfig {
  mode: PaymentProvider;
  purchasesEnabled: boolean;
}
export interface DemoCheckout extends Compra {
  actions: DemoResult[];
}
