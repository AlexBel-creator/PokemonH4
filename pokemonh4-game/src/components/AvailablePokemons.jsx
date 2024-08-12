import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailablePokemons = ({ onAddToTeam }) => {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await axios.get('http://localhost:5001/api/pokemons');
      setPokemons(response.data);
    };
    fetchPokemons();
  }, []);

  return (
    <div className="available-pokemons grid grid-cols-4 gap-4">
      {pokemons.map((pokemon) => (
        <div
          key={pokemon.id}
          className="pokemon-card border p-4 rounded shadow-lg text-center"
        >
          <img
            src={pokemon.frontSprite}
            alt={pokemon.name}
            className="mx-auto mb-2"
          />
          <h3 className="text-xl font-bold">{pokemon.name}</h3>
          <button
            onClick={() => onAddToTeam(pokemon.id)}
            className="mt-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-700"
          >
            Ajouter à l'équipe
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailablePokemons;
