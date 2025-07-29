
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
// Importa aquí tus otros componentes como EventosList si los tienes
// import EventosList from './components/EventosList'; 

function App() {
    return (
        <div className="App">
            <nav>
                <Link to="/">Home</Link> | <Link to="/login">Login</Link>
            </nav>
            <hr />
            <Routes>
                {/* <Route path="/" element={<EventosList />} /> */}
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;