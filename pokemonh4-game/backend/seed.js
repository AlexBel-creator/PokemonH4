const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchPokemonData(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await axios.get(url);
    const data = response.data;

    // Récupérer seulement les 2 premiers moves (ou moins si un Pokémon en a moins)
    const moves = data.moves.slice(0, 2).map(move => move.move.name);

    return {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        typeA: data.types[0]?.type.name,
        typeB: data.types[1]?.type.name || null,
        hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
        frontSprite: data.sprites.front_default,
        backSprite: data.sprites.back_default,
        skills: moves, // Ajouter les moves au retour
    };
}

async function main() {
    const numberOfPokemons = 300; // Nombre de Pokémon à récupérer

    for (let i = 1; i <= numberOfPokemons; i++) {
        const pokemonData = await fetchPokemonData(i);

        // Créer le Pokémon dans la base de données
        const createdPokemon = await prisma.pokemon.create({
            data: {
                name: pokemonData.name,
                typeA: pokemonData.typeA,
                typeB: pokemonData.typeB,
                hp: pokemonData.hp,
                attack: pokemonData.attack,
                defense: pokemonData.defense,
                frontSprite: pokemonData.frontSprite,
                backSprite: pokemonData.backSprite,
            },
        });

        // Créer les skills associés à ce Pokémon
        for (const moveName of pokemonData.skills) {
            await prisma.skill.create({
                data: {
                    name: moveName,
                    power: Math.floor(Math.random() * 50) + 50, // Générer une puissance aléatoire
                    accuracy: Math.floor(Math.random() * 20) + 80, // Générer une précision aléatoire
                    pokemonId: createdPokemon.id,
                },
            });
        }

        console.log(`Added ${pokemonData.name} and its skills to the database`);
    }

    console.log('All Pokémon data with skills has been seeded.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
