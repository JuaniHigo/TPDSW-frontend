import EntradaCard from '../../src/components/EntradaCard';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TicketQr from '../../src/components/TicketQr';
import PrivateRoute from '../../src/components/PrivateRoute';
import { AuthContext } from '../../src/context/AuthContext';
import type { AuthContextType } from '../../src/context/AuthContext';
import { AuthProvider } from '../../src/context/AuthProvider';
import { useAuth } from '../../src/hooks/useAuth';
import api from '../../src/services/api';
const user = {
  idUsuario: 1,
  dni: '12345678',
  nombre: 'Test',
  apellido: 'User',
  email: 'test@example.test',
  fechaNacimiento: null,
  rol: 'user' as const,
};
function AuthProbe() {
  const { user, loading } = useAuth();
  return <p>{loading ? 'loading' : (user?.nombre ?? 'guest')}</p>;
}
describe('session and tickets', () => {
  it('renders legacy QR as an image and a new token as one SVG', () => {
    const { rerender, container } = render(
      <TicketQr value="data:image/png;base64,aGVsbG8=" />,
    );
    expect(screen.getByAltText('Código QR de la entrada')).toHaveAttribute(
      'src',
      'data:image/png;base64,aGVsbG8=',
    );
    expect(container.querySelector('svg')).toBeNull();
    rerender(<TicketQr value="f640c60f-bc1c-4f38-9b96-c9f685c670fd" />);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    expect(container.querySelector('img')).toBeNull();
  });
  it('does not render malformed historical QR as another QR', () => {
    const { container } = render(
      <TicketQr value="data:text/html;base64,abc" />,
    );
    expect(screen.getByText(/QR histórico no disponible/)).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
  });
  it('restores user from the API rather than cached browser profile', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', 'broken json');
    const get = vi.spyOn(api, 'get').mockResolvedValueOnce({ data: user });
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument());
    expect(get).toHaveBeenCalledWith('/users/me');
    get.mockRestore();
  });
  it('cleans invalid authentication on restore failure', async () => {
    localStorage.setItem('token', 'expired');
    const get = vi.spyOn(api, 'get').mockRejectedValueOnce(new Error());
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByText('guest')).toBeInTheDocument());
    expect(localStorage.getItem('token')).toBeNull();
    get.mockRestore();
  });
  it('protects admin navigation for ordinary users', () => {
    const context: AuthContextType = {
      user,
      token: 'token',
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    };
    render(
      <AuthContext.Provider value={context}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route element={<PrivateRoute admin />}>
              <Route path="/admin" element={<p>Admin content</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('No tenés permisos');
    expect(screen.queryByText('Admin content')).toBeNull();
  });
});

describe('demo ticket marking', () => {
  it('identifies demo entries without marking ordinary entries', () => {
    const entry = {
      idEntrada: 9,
      codigoQr: 'f640c60f-bc1c-4f38-9b96-c9f685c670fd',
      idEvento: 1,
      fechaHora: '2030-01-01T20:00:00Z',
      nombreLocal: 'Home',
      nombreVisitante: 'Away',
      nombreSector: 'Popular',
      esDemo: true,
    };
    const { rerender } = render(<EntradaCard entrada={entry} />);
    expect(
      screen.getByText('Entrada demo · sin validez para ingreso'),
    ).toBeInTheDocument();
    rerender(<EntradaCard entrada={{ ...entry, esDemo: false }} />);
    expect(
      screen.queryByText('Entrada demo · sin validez para ingreso'),
    ).toBeNull();
  });
});
