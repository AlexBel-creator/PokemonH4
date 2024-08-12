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
            return res.status(400).json({ error: "UUID de l'utilisateur manquant" });
        }

        const user = await prisma.user.findUnique({
            where: { uuid: userUuid },
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        let team = await prisma.team.findFirst({
            where: { userId: user.uuid },
            include: { pokemons: true }
        });

        if (!team) {
            team = await prisma.team.create({
                data: {
                    name: 'Équipe de ' + user.username,
                    userId: user.uuid,
                },
            });
        }

        // Vérifiez si le Pokémon est déjà dans l'équipe
        const alreadyInTeam = await prisma.teamPokemon.findFirst({
            where: {
                teamId: team.id,
                pokemonId: pokemonId,
            }
        });

        if (alreadyInTeam) {
            return res.status(400).json({ error: 'Ce Pokémon est déjà dans votre équipe.' });
        }

        const newTeamPokemon = await prisma.teamPokemon.create({
            data: {
                teamId: team.id,
                pokemonId: pokemonId,
            },
            include: {
                pokemon: true, // Inclure les détails du Pokémon ajouté
            },
        });

        // Renvoie les détails du Pokémon ajouté
        res.status(200).json({ pokemon: newTeamPokemon.pokemon });
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


router.delete('/remove', async (req, res) => {
    const userUuid = req.headers['x-user-uuid'];
    const { pokemonId } = req.body;

    if (!userUuid) {
        return res.status(400).json({ error: "UUID de l'utilisateur manquant" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { uuid: userUuid },
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const team = await prisma.team.findFirst({
            where: { userId: user.uuid },
        });

        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // Supprimer le Pokémon de l'équipe
        await prisma.teamPokemon.deleteMany({
            where: {
                teamId: team.id,
                pokemonId: pokemonId,
            },
        });

        res.status(200).json({ message: 'Pokémon supprimé de l\'équipe' });
    } catch (error) {
        console.error("Erreur lors de la suppression du Pokémon:", error);
        res.status(500).json({ error: 'Erreur lors de la suppression du Pokémon' });
    }
});
module.exports = router;
