// components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5001/api/logout',
        {},
        { withCredentials: true },
      );
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="mr-4 hover:underline">
            Accueil
          </Link>
          <Link to="/team" className="mr-4 hover:underline">
            Mon Équipe
          </Link>
          <Link to="/test" className="mr-4 hover:underline">
            Test
          </Link>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
