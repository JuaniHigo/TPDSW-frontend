import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import DashboardH from "./pages/dashboardH";
import "./App.css";
import EventoDetalle from "./components/EventoDetalle";
import PaginaPago from "./pages/PaginaPago";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import "./App.css";
import CompraExitosa from "./pages/CompraExitosa";
import MisEntradas from "./pages/MisEntradas";

// Componentes temporales
const Configuracion = () => <h2>Configuración (Página en construcción)</h2>;

function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />
      <main className="content-wrap">
        {/* El componente <Routes> gestiona qué página mostrar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evento/:id" element={<EventoDetalle />} />
          <Route path="/evento/:id/comprar" element={<PaginaPago />} />{" "}
          {/* <-- RUTA AÑADIDA */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/mis-entradas" element={<MisEntradas />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/dashboardH" element={<DashboardH />} />
          <Route path="/compra-exitosa" element={<CompraExitosa />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
