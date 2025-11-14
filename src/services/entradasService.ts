import api from "./api";

export interface EntradaComprada {
  idEntrada: number;
  codigoQr: string;
  fechaCompra: string;
  idEvento: number;
  fechaHora: string;
  torneo: string;
  nombreLocal: string;
  logoLocal?: string;
  nombreVisitante: string;
  logoVisitante?: string;
  nombreSector: string;
}

export const getMisEntradas = async (): Promise<EntradaComprada[]> => {
  try {
    const response = await api.get("/users/me/entradas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las entradas compradas:", error);
    throw error;
  }
};
