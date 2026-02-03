const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coins: { type: Number, default: 10 },
    scores: {
        freefire: { type: Number, default: 0 },
        coc: { type: Number, default: 0 },
        cor: { type: Number, default: 0 },
        pubg: { type: Number, default: 0 },
        amongus: { type: Number, default: 0 },
        chess: { type: Number, default: 0 },
        roblox: { type: Number, default: 0 }
    },
    progress: {
        currentGame: String,
        currentQuestionIndex: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('User', userSchema);
