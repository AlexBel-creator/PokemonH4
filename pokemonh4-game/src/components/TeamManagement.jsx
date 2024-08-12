import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AvailablePokemons from './AvailablePokemons';
import PlayerTeam from './PlayerTeam';

const TeamManagement = () => {
  const [teamPokemons, setTeamPokemons] = useState([]);
  const [error, setError] = useState(''); // État pour gérer les messages d'erreur

  // Fonction pour récupérer les Pokémon de l'équipe
  const fetchTeamPokemons = async () => {
    try {
      const uuid = localStorage.getItem('uuid'); // Récupérer l'UUID du localStorage

      if (!uuid) {
        throw new Error("UUID de l'utilisateur non trouvé");
      }

      const response = await axios.get(
        `http://localhost:5001/api/teams/team`, // URL correcte pour la route
        {
          params: { uuid }, // Envoyer UUID comme paramètre de la requête
        },
      );

      setTeamPokemons(response.data.pokemons || []);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des Pokémon de l'équipe:",
        error,
      );
      setError("Erreur lors de la récupération des Pokémon de l'équipe.");
    }
  };

  useEffect(() => {
    fetchTeamPokemons();
  }, []);

  const handleAddToTeam = async (pokemonId) => {
    try {
      const uuid = localStorage.getItem('uuid'); // Récupérer l'UUID du localStorage

      if (!uuid) {
        throw new Error("UUID de l'utilisateur non trouvé");
      }

      const response = await axios.post(
        'http://localhost:5001/api/teams/add',
        { pokemonId },
        {
          headers: { 'x-user-uuid': uuid },
        },
      );

      // Recharger les Pokémon de l'équipe sans recharger la page
      fetchTeamPokemons();
      setError(''); // Réinitialiser le message d'erreur en cas de succès
    } catch (error) {
      console.error("Erreur lors de l'ajout du Pokémon à l'équipe:", error);
      setError(
        error.response?.data?.error ||
          "Erreur lors de l'ajout du Pokémon à l'équipe.",
      ); // Afficher l'erreur du backend si disponible
    }
  };

  return (
    <div className="team-management container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Composez Votre Équipe
      </h1>
      <div className="flex">
        <div className="w-2/3">
          <AvailablePokemons onAddToTeam={handleAddToTeam} />
        </div>
        <div className="w-1/3 ml-8">
          <PlayerTeam pokemons={teamPokemons} />
        </div>
      </div>
      {/* Afficher le message d'erreur s'il y en a un */}
      {error && (
        <div className="error-message text-red-500 text-center mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
