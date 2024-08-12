const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Récupérer toutes les compétences
router.get('/', async (req, res) => {
    try {
        const skills = await prisma.skill.findMany();
        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

// Récupérer une compétence par ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const skill = await prisma.skill.findUnique({
            where: { id: parseInt(id) },
        });

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        res.json(skill);
    } catch (error) {
        console.error('Error fetching skill:', error);
        res.status(500).json({ error: 'Failed to fetch skill' });
    }
});

// Ajouter une compétence à un Pokémon
router.post('/add', async (req, res) => {
    const { name, power, accuracy, pokemonId } = req.body;
    try {
        const skill = await prisma.skill.create({
            data: {
                name,
                power,
                accuracy,
                pokemonId,
            }
        });
        res.status(201).json(skill);
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ error: 'Failed to add skill' });
    }
});

module.exports = router;
