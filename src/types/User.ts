export interface User {
  idUsuario: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string | null;
  rol: 'admin' | 'user';
}
