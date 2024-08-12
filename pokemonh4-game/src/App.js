import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import TeamManagement from './components/TeamManagement';
import MainMenu from './components/MainMenu'; // Importation du composant MainMenu
import Battle from './components/Battle';
function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/main-menu" element={<MainMenu />} /> {/* Nouvelle route pour le menu principal */}
      <Route path="/team-management" element={<TeamManagement />} /> {/* Route pour la gestion d'équipe */}
      <Route path="/battle" element={<Battle />} /> {/* Route pour la gestion d'équipe */}
    </Routes>
  );
}

export default App;
