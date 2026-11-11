import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api, { errorMessage } from '../services/api';
import type { User } from '../types/User';
import './admin/Admin.css';
export default function Cuenta() {
  const { user, updateUser, logout } = useAuth(),
    navigate = useNavigate();
  const [nombre, setNombre] = useState(user?.nombre ?? ''),
    [apellido, setApellido] = useState(user?.apellido ?? ''),
    [fecha, setFecha] = useState(user?.fechaNacimiento ?? '');
  const [currentPassword, setCurrent] = useState(''),
    [password, setPassword] = useState(''),
    [confirm, setConfirm] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false);
  async function profile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      updateUser(
        (
          await api.patch<User>('/users/me', {
            nombre,
            apellido,
            fechaNacimiento: fecha || null,
          })
        ).data,
      );
      setMessage('Datos actualizados');
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function change(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    setBusy(true);
    try {
      await api.post('/users/me/password', { currentPassword, password });
      logout();
      navigate('/login');
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-container">
      <h1>Mi cuenta</h1>
      <p>
        {user?.email} · DNI {user?.dni}
      </p>
      {message && <p role="status">{message}</p>}
      <form onSubmit={(e) => void profile(e)}>
        <h2>Datos personales</h2>
        <label>
          Nombre
          <input
            required
            minLength={2}
            maxLength={100}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label>
          Apellido
          <input
            required
            minLength={2}
            maxLength={100}
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </label>
        <label>
          Fecha de nacimiento
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </label>
        <button disabled={busy}>Guardar datos</button>
      </form>
      <form onSubmit={(e) => void change(e)}>
        <h2>Cambiar contraseña</h2>
        <label>
          Contraseña actual
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>
        <label>
          Nueva contraseña
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Repetir contraseña
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>
        <button disabled={busy}>Cambiar contraseña</button>
      </form>
    </div>
  );
}
