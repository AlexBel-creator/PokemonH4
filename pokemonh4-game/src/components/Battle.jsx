import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';

const Battle = () => {
  const [userPokemons, setUserPokemons] = useState([]);
  const [enemyPokemons, setEnemyPokemons] = useState([]);

  const fetchUserTeam = async () => {
    try {
      const uuid = localStorage.getItem('uuid');

      if (!uuid) {
        throw new Error("UUID de l'utilisateur non trouvé");
      }

      // Récupérer les Pokémon de l'utilisateur
      const response = await axios.get('http://localhost:5001/api/teams/team', {
        params: { uuid },
      });

      setUserPokemons(response.data.pokemons || []);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des Pokémon de l'utilisateur:",
        error,
      );
    }
  };

  const generateEnemyTeam = async (length) => {
    try {
      const enemyPokemonIds = Array.from(
        { length },
        () => Math.floor(Math.random() * 300) + 1,
      );

      const newEnemyPokemons = await Promise.all(
        enemyPokemonIds.map(async (id) => {
          const res = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${id}`,
          );
          return {
            id: res.data.id,
            name: res.data.name,
            frontSprite: res.data.sprites.front_default,
          };
        }),
      );

      setEnemyPokemons(newEnemyPokemons);
    } catch (error) {
      console.error("Erreur lors de la génération de l'équipe ennemie:", error);
    }
  };

  const startGame = () => {
    if (window.game) {
      window.game.destroy(true);
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload,
        create,
      },
      audio: {
        disableWebAudio: true, // Désactive l'audio
      },
    };

    window.game = new Phaser.Game(config);

    function preload() {
      // Charger les sprites des Pokémon du joueur
      userPokemons.forEach((pokemon, index) => {
        this.load.image(`playerPokemon-${index}`, pokemon.frontSprite);
      });

      // Charger les sprites des Pokémon ennemis
      enemyPokemons.forEach((pokemon, index) => {
        this.load.image(`enemyPokemon-${index}`, pokemon.frontSprite);
      });
    }

    function create() {
      this.add.text(100, 50, 'Mon équipe', {
        font: '24px Arial',
        fill: '#fff',
      });
      userPokemons.forEach((pokemon, index) => {
        this.add.sprite(100 + index * 150, 150, `playerPokemon-${index}`);
      });

      this.add.text(100, 300, 'Équipe ennemie', {
        font: '24px Arial',
        fill: '#fff',
      });
      enemyPokemons.forEach((pokemon, index) => {
        this.add.sprite(100 + index * 150, 400, `enemyPokemon-${index}`);
      });
    }
  };

  useEffect(() => {
    fetchUserTeam();
  }, []);

  useEffect(() => {
    if (userPokemons.length > 0 && enemyPokemons.length > 0) {
      startGame();
    }
  }, [userPokemons, enemyPokemons]);

  const handleGenerateEnemyTeam = async () => {
    await generateEnemyTeam(userPokemons.length);
  };

  const handleBattle = () => {
    alert('Le combat commence!');
  };

  return (
    <div className="flex justify-center items-center mt-12">
      {/* <div id="phaser-container" className="w-[800px] h-[600px] mx-auto " /> */}
      <div className="ml-6 space-y-4 mb-4">
        <button
          onClick={handleGenerateEnemyTeam}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Générer une nouvelle équipe ennemie
        </button>
        <button
          onClick={handleBattle}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded "
        >
          Combattre
        </button>
      </div>
    </div>
  );
};

export default Battle;
