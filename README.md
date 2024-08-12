Pokémon Battle App - Ratraphe H4
Description
Pokémon Battle App est une application web interactive permettant aux utilisateurs de gérer leurs équipes de Pokémon et de les engager dans des combats dynamiques contre des adversaires générés aléatoirement. Cette application combine React pour le frontend, Phaser.js pour les animations de combat, et Prisma pour la gestion de la base de données.

Fonctionnalités
Inscription et Connexion : Les utilisateurs peuvent s'inscrire et se connecter pour gérer leurs équipes de Pokémon.
Gestion d'Équipe : Ajoutez, supprimez et organisez vos Pokémon au sein de votre équipe.
Combat Dynamique : Engagez des combats avec votre équipe contre des adversaires aléatoires.
Animations avec Phaser.js : Profitez d'animations interactives et immersives lors des combats.
Barres de Vie Dynamiques : Les barres de vie des Pokémon se mettent à jour en temps réel en fonction des dégâts reçus.
Logs de Combat : Suivez le déroulement du match via des logs affichés en temps réel.
Prérequis
Node.js (version 14 ou supérieure)
npm (version 6 ou supérieure)
Prisma CLI (npx recommandé)
Une base de données (MySQL, PostgreSQL, etc.)
Installation

1. Cloner le projet
   Clonez le projet sur votre machine locale en utilisant la commande suivante :

`git clone https://github.com/AlexBel-creator/PokemonH4`

`cd pokemonh4-game` 2. Installation des dépendances

2. Installation des dépendances
   Installez toutes les dépendances nécessaires avec npm :

`npm install`

3. Configuration de la Base de Données
   Configurez votre base de données dans le fichier .env en suivant le modèle fourni dans .env.example.
   Placez le fichier .env à la racine de votre projet.

4. Initialisation de la Base de Données
   Exécutez les étapes suivantes pour configurer et initialiser votre base de données :

Exécutez les migrations Prisma pour créer la structure de votre base de données :

`npx prisma migrate dev --name init`
Générez le client Prisma :

`npx prisma generate`
Exécutez le script de seed pour insérer les données initiales dans la base de données :

node seed.js 4. Démarrage du Serveur dans le dossier backend

`node index.js `

5. Demarage du jeu
   `npm start`
