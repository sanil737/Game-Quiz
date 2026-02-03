const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

// API: Get Questions Sorted by Difficulty
app.get('/api/questions/:game', (req, res) => {
    const game = req.params.game;
    const filePath = path.join(__dirname, 'data', `${game}.json`);
    
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath);
        let questions = JSON.parse(rawData);
        
        // Sorting Logic: Very Easy -> Easy -> Normal -> Hard
        const difficultyOrder = { "Very Easy": 1, "Easy": 2, "Normal": 3, "Hard": 4 };
        questions.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        
        res.json(questions);
    } else {
        res.status(404).send('Game not found');
    }
});

// API: Save Score & Update Coins
app.post('/api/user/update', async (req, res) => {
    const { name, coins, score, game } = req.body;
    let user = await User.findOne({ name });
    
    if (!user) {
        user = new User({ name, coins, scores: { [game]: score } });
    } else {
        user.coins = coins;
        user.scores[game] = Math.max(user.scores[game], score);
    }
    await user.save();
    res.json(user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
