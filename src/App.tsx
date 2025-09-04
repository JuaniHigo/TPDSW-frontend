import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DashboardH from './pages/dashboardH';
import './App.css';
import Footer from './components/Footer';
import EventoDetalle from './components/EventoDetalle';
import ScrollToTop from './components/ScrollToTop';

const MisEntradas = () => <h2>Mis Entradas (Página en construcción)</h2>;
const Configuracion = () => <h2>Configuración (Página en construcción)</h2>;

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
                    <Route path="/mis-entradas" element={<MisEntradas />} />
                    <Route path="/configuracion" element={<Configuracion />} />
                    <Route path="/dashboardH" element={<DashboardH />} />
                  
                </Routes>
            </main>
            <Footer /> 
        </div>
    );
}

export default App;