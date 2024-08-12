import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayerTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const uuid = localStorage.getItem('uuid'); // Récupérer l'UUID du localStorage

        if (!uuid) {
          throw new Error("UUID de l'utilisateur non trouvé");
        }

        // Requête GET pour récupérer les Pokémon de l'équipe
        const response = await axios.get(
          'http://localhost:5001/api/teams/team',
          {
            params: { uuid },
          },
        );

        setTeam(response.data.pokemons || []); // Assigner les Pokémon récupérés à l'état
      } catch (err) {
        setError("Erreur lors du chargement de l'équipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerTeam;
