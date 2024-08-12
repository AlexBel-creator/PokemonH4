import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const goToMainMenu = () => {
    navigate('/main-menu');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between">
        <button
          onClick={goToMainMenu}
          className="text-white font-semibold text-lg hover:underline"
        >
          Main Menu
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
