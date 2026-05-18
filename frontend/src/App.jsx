import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Login from './pages/Login';
import Servicios from './pages/Servicios';
import Informacion from './pages/Informacion';
import Resumen from './pages/Resumen';
import Agenda from './pages/Agenda';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;