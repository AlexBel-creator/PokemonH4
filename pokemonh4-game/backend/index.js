const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const authenticationRoutes = require('./routes/authentification');
const pokemonRoutes = require('./routes/pokemon');
const skillRoutes = require('./routes/skill');
const teamRoutes = require('./routes/team');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authenticationRoutes);
app.use('/api/pokemons', pokemonRoutes); // Ajout des routes Pokémon
app.use('/api/teams', teamRoutes); // Ajout des routes d'équipe
app.use('/api/skills', skillRoutes); // Ajout des routes d'équipe



// Démarrer le serveur
app.listen(5001, () => {
    console.log('Server is running on http://localhost:5001');
});
