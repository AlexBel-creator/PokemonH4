import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayerTeam = ({ updateTrigger }) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const uuid = localStorage.getItem('uuid');

        if (!uuid) {
          throw new Error("UUID de l'utilisateur non trouvé");
        }

        const response = await axios.get(
          'http://localhost:5001/api/teams/team',
          {
            params: { uuid },
          },
        );

        setTeam(response.data.pokemons || []);
      } catch (err) {
        setError("Erreur lors du chargement de l'équipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [updateTrigger]); // Ajoutez updateTrigger comme dépendance

  const handleRemovePokemon = async (pokemonId) => {
    try {
      const uuid = localStorage.getItem('uuid');

      if (!uuid) {
        throw new Error("UUID de l'utilisateur non trouvé");
      }

      await axios.delete('http://localhost:5001/api/teams/remove', {
        headers: { 'x-user-uuid': uuid },
        data: { pokemonId },
      });

      setTeam((prevTeam) =>
        prevTeam.filter((pokemon) => pokemon.id !== pokemonId),
      );
    } catch (err) {
      setError('Erreur lors de la suppression du Pokémon.');
    }
  };

  if (loading) {
    return <p>Chargement de l'équipe...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="player-team">
      <h2 className="text-2xl font-bold mb-4">Mon Équipe</h2>
      {team.length === 0 ? (
        <p>Vous n'avez pas encore ajouté de Pokémon à votre équipe.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {team.map((pokemon) => (
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
                onClick={() => handleRemovePokemon(pokemon.id)}
                className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerTeam;
