import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Battle() {
  const arenaRef = useRef(null);
  const goBack = useNavigate();
  const [combatLogs, setCombatLogs] = useState([]);

  useEffect(() => {
    async function getPlayerTeam() {
      try {
        const userId = localStorage.getItem('uuid');
        const teamResponse = await axios.get(
          'http://localhost:5001/api/teams/team',
          {
            params: { uuid: userId },
          },
        );
        return teamResponse.data.pokemons;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'équipe du joueur:",
          error,
        );
        return [];
      }
    }

    async function getEnemyTeam(playerTeamSize) {
      try {
        const randomIds = Array.from(
          { length: playerTeamSize },
          () => Math.floor(Math.random() * 151) + 1,
        );
        const enemies = await Promise.all(
          randomIds.map((id) =>
            axios.get(`http://localhost:5001/api/pokemons/${id}`),
          ),
        );
        return enemies.map((res) => res.data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des Pokémon ennemis:',
          error,
        );
        return [];
      }
    }

    async function initiateCombat() {
      const playerTeam = await getPlayerTeam();
      if (!playerTeam || playerTeam.length === 0) {
        console.error('Aucune équipe de joueur disponible.');
        return;
      }

      const enemyTeam = await getEnemyTeam(playerTeam.length);
      if (!enemyTeam || enemyTeam.length === 0) {
        console.error('Aucune équipe ennemie disponible.');
        return;
      }

      const gameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        backgroundColor: '#98FB98',
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: {
          preload: preloadAssets,
          create: createScene,
          update: updateScene,
        },
        parent: arenaRef.current,
      };

      const gameInstance = new Phaser.Game(gameConfig);

      let playerIndex = 0;
      let enemyIndex = 0;
      let playerMoveButtons = [];

      function preloadAssets() {
        playerTeam.forEach((pokemon, index) => {
          this.load.image(`playerPokemon${index}`, pokemon.frontSprite);
        });
        enemyTeam.forEach((pokemon, index) => {
          this.load.image(`enemyPokemon${index}`, pokemon.frontSprite);
        });
      }

      function createScene() {
        if (
          !playerTeam ||
          !enemyTeam ||
          playerTeam.length === 0 ||
          enemyTeam.length === 0
        ) {
          console.error(
            'Les données des équipes ne sont pas disponibles ou sont incorrectes.',
          );
          return;
        }

        this.playerSprite = this.add.sprite(
          150,
          300,
          `playerPokemon${playerIndex}`,
        );
        this.enemySprite = this.add.sprite(
          650,
          300,
          `enemyPokemon${enemyIndex}`,
        );

        this.playerHPBarBg = this.add.graphics();
        this.enemyHPBarBg = this.add.graphics();
        this.playerHPBar = this.add.graphics();
        this.enemyHPBar = this.add.graphics();

        // Draw the health bar background
        this.playerHPBarBg.fillStyle(0x000000);
        this.playerHPBarBg.fillRect(100, 230, 200, 20);
        this.enemyHPBarBg.fillStyle(0x000000);
        this.enemyHPBarBg.fillRect(550, 230, 200, 20);

        updateHealthBars.call(this);

        displayMoveOptions.call(this);
      }

      const updateHealthBars = function () {
        this.playerHPBar.clear();
        this.enemyHPBar.clear();

        const playerHPPercent =
          playerTeam[playerIndex].hp / playerTeam[playerIndex].maxHp;
        const enemyHPPercent =
          enemyTeam[enemyIndex].hp / enemyTeam[enemyIndex].maxHp;

        this.playerHPBar.fillStyle(0x00ff00);
        this.playerHPBar.fillRect(100, 270, 300 * playerHPPercent, 20);

        this.enemyHPBar.fillStyle(0xff0000);
        this.enemyHPBar.fillRect(550, 270, 200 * enemyHPPercent, 20);
      };

      const displayMoveOptions = function () {
        playerMoveButtons.forEach((element) => element.destroy());
        playerMoveButtons = [];

        const startX = 50;
        const startY = 450;

        if (playerTeam[playerIndex].skills) {
          playerTeam[playerIndex].skills.forEach((skill, i) => {
            const moveText = this.add.text(
              startX + i * 150,
              startY,
              `${skill.name}`,
              {
                fontSize: '16px',
                fill: '#000',
                backgroundColor: '#fff',
                padding: { x: 25, y: 25 },
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#000',
              },
            );
            moveText
              .setInteractive()
              .on('pointerdown', () =>
                handlePlayerAttack.call(
                  this,
                  skill,
                  playerTeam[playerIndex],
                  enemyTeam[enemyIndex],
                ),
              );
            playerMoveButtons.push(moveText);
          });
        } else {
          console.warn(
            "Le Pokémon sélectionné n'a pas de mouvements disponibles.",
          );
        }
      };

      const handlePlayerAttack = function (skill, playerPokemon, enemyPokemon) {
        this.tweens.add({
          targets: this.playerSprite,
          x: 180,
          duration: 100,
          yoyo: true,
        });

        const damage = skill.power || 0;
        enemyPokemon.hp -= damage;
        updateHealthBars.call(this);

        setCombatLogs((prevLogs) => [
          ...prevLogs,
          `${playerPokemon.name} a attaqué ${enemyPokemon.name} avec ${skill.name}, causant ${damage} dégâts.`,
        ]);

        if (enemyPokemon.hp <= 0) {
          enemyIndex++;
          if (enemyIndex >= enemyTeam.length) {
            setTimeout(() => goBack('/main-menu'), 2000);
            return;
          } else {
            this.enemySprite.setTexture(`enemyPokemon${enemyIndex}`);
            updateHealthBars.call(this);
          }
        }

        setTimeout(() => {
          handleEnemyAttack.call(this, playerPokemon, enemyPokemon);
        }, 1000);
      };

      const handleEnemyAttack = function (playerPokemon, enemyPokemon) {
        this.tweens.add({
          targets: this.enemySprite,
          x: 620,
          duration: 100,
          yoyo: true,
        });

        const damage = enemyPokemon.attack || 0;
        playerPokemon.hp -= damage;
        updateHealthBars.call(this);

        setCombatLogs((prevLogs) => [
          ...prevLogs,
          `${enemyPokemon.name} a attaqué ${playerPokemon.name} et a causé ${damage} dégâts.`,
        ]);

        if (playerPokemon.hp <= 0) {
          playerIndex++;
          if (playerIndex >= playerTeam.length) {
            setTimeout(() => goBack('/main-menu'), 2000);
          } else {
            this.playerSprite.setTexture(`playerPokemon${playerIndex}`);
            updateHealthBars.call(this);
            displayMoveOptions.call(this);
          }
        }
      };

      function updateScene() {}

      return () => {
        gameInstance.destroy(true);
      };
    }

    initiateCombat();
  }, [goBack]);

  return (
    <>
      <Navbar />
      <div ref={arenaRef} style={{ height: '80vh', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        >
          {combatLogs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default Battle;
