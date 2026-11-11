import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';
import EventoDetalle from './components/EventoDetalle';
import PaginaPago from './pages/PaginaPago';
import PagoDemo from './pages/PagoDemo';
import ScrollToTop from './components/ScrollToTop';
import CompraExitosa from './pages/CompraExitosa';
import AdminPanel from './pages/AdminPanel';
import EditarEvento from './pages/admin/EditarEvento';
import EditarClub from './pages/admin/EditarClub';
import EditarEstadio from './pages/admin/EditarEstadio';
import MisEntradas from './pages/MisEntradas';
import PrivateRoute from './components/PrivateRoute';
import Cuenta from './pages/Cuenta';
import './App.css';
function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />
      <main className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evento/:id" element={<EventoDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<PrivateRoute />}>
            <Route path="/pago-demo/:idCompra" element={<PagoDemo />} />
            <Route path="/evento/:id/comprar" element={<PaginaPago />} />
            <Route path="/mis-entradas" element={<MisEntradas />} />
            <Route path="/configuracion" element={<Cuenta />} />
            <Route path="/dashboardH" element={<Cuenta />} />
            <Route path="/compra-exitosa" element={<CompraExitosa />} />
            <Route path="/compra-fallida" element={<CompraExitosa />} />
            <Route path="/compra-pendiente" element={<CompraExitosa />} />
          </Route>
          <Route element={<PrivateRoute admin />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/EditarEvento" element={<EditarEvento />} />
            <Route path="/admin/EditarEvento/:id" element={<EditarEvento />} />
            <Route path="/admin/EditarClub" element={<EditarClub />} />
            <Route path="/admin/EditarEstadio" element={<EditarEstadio />} />
          </Route>
          <Route path="*" element={<p>Página no encontrada</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
