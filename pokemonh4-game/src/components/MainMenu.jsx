import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Menu Principal</h1>
      <button
        onClick={() => navigate('/team-management')}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700"
      >
        Composer son Équipe
      </button>
      <button
        onClick={() => navigate('/battle')}
        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
      >
        Combattre
      </button>
    </div>
  );
};

export default MainMenu;
