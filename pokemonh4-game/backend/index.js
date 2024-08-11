const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const authenticationRoutes = require('./routes/authentication');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Utiliser les routes d'authentification
app.use('/api', authenticationRoutes);

// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Token absent

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403); // Token invalide
        req.user = user;
        next(); // Passer à la route suivante
    });
}

// Route protégée pour obtenir les informations de l'utilisateur
app.get('/api/me', authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { uuid: req.user.uuid } });
    if (user) {
        res.json({ username: user.username, uuid: user.uuid });
    } else {
        res.sendStatus(404); // User non trouvé
    }
});

app.listen(5001, () => {
    console.log('Server is running on http://localhost:5001');
});
