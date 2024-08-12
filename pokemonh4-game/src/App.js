import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import TestComponent from './components/TestComponent';
import TeamManagement from './components/TeamManagement'; // Importation du composant

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/test" element={<TestComponent />} />
      <Route path="/team-management" element={<TeamManagement />} /> {/* Nouvelle route pour la gestion d'équipe */}
    </Routes>
  );
}

export default App;
