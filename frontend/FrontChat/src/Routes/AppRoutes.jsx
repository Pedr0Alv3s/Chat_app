import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Chat from '../pages/Chat';
import Perfil from '../pages/Perfil';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/chat/:salaId" element={<Chat />} />
                <Route path="/perfil" element={<Perfil />} />
            </Routes>
        </BrowserRouter>
    );
}