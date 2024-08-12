const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Route pour ajouter un Pokémon à l'équipe
router.post('/add', async (req, res) => {
    try {
        const userUuid = req.headers['x-user-uuid']; // Lire l'UUID depuis les headers
        const { pokemonId } = req.body;

        if (!userUuid) {
            return res.status(400).json({ error: 'UUID de l\'utilisateur manquant' });
        }

        const user = await prisma.user.findUnique({
            where: { uuid: userUuid }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Trouver ou créer une équipe pour l'utilisateur
        let team = await prisma.team.findFirst({
            where: { userId: user.uuid },
            include: { pokemons: true }
        });

        if (!team) {
            // Créer une nouvelle équipe si elle n'existe pas encore
            team = await prisma.team.create({
                data: {
                    name: 'Équipe de ' + user.username, // Nom par défaut de l'équipe
                    userId: user.uuid
                }
            });
        }

        // Vérifier la taille de l'équipe avant d'ajouter un nouveau Pokémon
        if (team.pokemons.length >= 6) {
            return res.status(400).json({ error: 'L\'équipe est déjà complète. Impossible d\'ajouter plus de Pokémon.' });
        }

        // Ajouter le Pokémon à l'équipe
        await prisma.teamPokemon.create({
            data: {
                teamId: team.id,
                pokemonId: pokemonId
            }
        });

        res.status(200).json({ message: 'Pokémon ajouté à l\'équipe' });
    } catch (error) {
        console.error("Erreur lors de l'ajout du Pokémon à l'équipe:", error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du Pokémon à l\'équipe' });
    }
});

router.get('/team', async (req, res) => {
    const uuid = req.query.uuid;

    if (!uuid) {
        return res.status(400).json({ error: 'UUID de l\'utilisateur manquant' });
    }

    try {
        // Trouver l'utilisateur avec l'UUID
        const user = await prisma.user.findUnique({
            where: { uuid: uuid }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Trouver l'équipe associée à l'utilisateur
        const team = await prisma.team.findFirst({
            where: { userId: user.uuid },
            include: { pokemons: { include: { pokemon: true } } } // Inclure les détails des Pokémon
        });

        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // Répondre avec les détails des Pokémon de l'équipe
        res.json({ pokemons: team.pokemons.map(tp => tp.pokemon) });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'équipe:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});


module.exports = router;
