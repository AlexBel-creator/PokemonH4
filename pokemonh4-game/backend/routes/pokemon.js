const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Récupérer tous les Pokémon
router.get('/', async (req, res) => {
    try {
        const pokemons = await prisma.pokemon.findMany({
            include: {
                skills: true,
            }
        });
        res.json(pokemons);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Pokémon' });
    }
});

// Récupérer un Pokémon par ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pokemon = await prisma.pokemon.findUnique({
            where: { id: parseInt(id) },
            include: {
                skills: true,
            }
        });
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Pokémon' });
    }
});

// Ajouter un Pokémon à l'utilisateur
router.post('/add-to-user', async (req, res) => {
    const { userId, pokemonId } = req.body;
    try {
        const userPokemon = await prisma.userPokemon.create({
            data: {
                userId,
                pokemonId,
            }
        });
        res.status(201).json(userPokemon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add Pokémon to user' });
    }
});

module.exports = router;
