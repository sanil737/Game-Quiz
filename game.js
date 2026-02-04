let state = {
    playerName: localStorage.getItem('quiz_user') || "",
    coins: parseInt(localStorage.getItem('quiz_coins')) || 10,
    currentGame: null,
    questions: [],
    currentIndex: 0,
    score: 0
};

// INITIALIZE
window.onload = () => {
    if(state.playerName) {
        document.getElementById('username-input').value = state.playerName;
        unlockGames();
        updateProfile();
    }
    checkResume();
};

document.getElementById('username-input').oninput = (e) => {
    state.playerName = e.target.value;
    localStorage.setItem('quiz_user', state.playerName);
    state.playerName.length > 2 ? unlockGames() : lockGames();
    updateProfile();
};

function unlockGames() {
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('locked'));
    document.querySelector('.helper-text').innerText = "Pick a game to start! 🔥";
}

function lockGames() {
    document.querySelectorAll('.game-card').forEach(c => c.classList.add('locked'));
}

function updateProfile() {
    document.getElementById('player-name').innerText = state.playerName || "Guest";
    document.getElementById('avatar').innerText = state.playerName ? state.playerName[0].toUpperCase() : "?";
    document.getElementById('coin-count').innerText = state.coins;
    
    // Level Badge Logic
    let badge = "Beginner 🟢";
    if(state.coins > 50) badge = "Pro 🔵";
    if(state.coins > 150) badge = "Legend 🟣";
    document.getElementById('rank-badge').innerText = badge;
}

// GAME ENGINE
async function selectGame(gameId) {
    state.currentGame = gameId;
    document.body.className = `theme-${gameId}`;
    
    try {
        const res = await fetch(`./questions/${gameId}.json`);
        const data = await res.json();
        
        // Sorting Logic: Very Easy -> Hard
        const diffs = {"Very Easy": 1, "Easy": 2, "Normal": 3, "Hard": 4};
        state.questions = data.sort((a,b) => diffs[a.difficulty] - diffs[b.difficulty]);
        
        startQuiz();
    } catch (e) {
        alert("Error loading " + gameId + ".json. Check your questions folder!");
    }
}

function startQuiz() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = state.questions[state.currentIndex];
    
    // Save Progress
    saveProgress();

    // UI Updates
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('difficulty-badge').innerText = q.difficulty;
    document.getElementById('q-progress').innerText = `Q ${state.currentIndex + 1}/${state.questions.length}`;
    document.getElementById('progress-bar').style.width = `${((state.currentIndex) / state.questions.length) * 100}%`;

    const container = document.getElementById('options-grid');
    container.innerHTML = '';
    const labels = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span style="color:var(--gold);margin-right:10px">${labels[i]}:</span> ${opt}`;
        btn.onclick = () => handleAnswer(btn, opt, q.answer);
        container.appendChild(btn);
    });
}

function handleAnswer(btn, selected, correct) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if(selected === correct) {
        btn.classList.add('correct');
        state.score += 10;
        state.coins += 1;
        vibrate(50);
    } else {
        btn.classList.add('wrong');
        vibrate([100, 50, 100]);
        // Highlight correct one
        allBtns.forEach(b => {
            if(b.innerText.includes(correct)) b.classList.add('correct');
        });
    }

    localStorage.setItem('quiz_coins', state.coins);
    updateProfile();

    setTimeout(() => {
        state.currentIndex++;
        if(state.currentIndex < state.questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
}

function saveProgress() {
    const data = {
        game: state.currentGame,
        index: state.currentIndex,
        score: state.score
    };
    localStorage.setItem('quiz_resume_data', JSON.stringify(data));
}

function checkResume() {
    const saved = localStorage.getItem('quiz_resume_data');
    if(saved) {
        document.getElementById('resume-container').classList.remove('hidden');
    }
}

async function resumeGame() {
    const saved = JSON.parse(localStorage.getItem('quiz_resume_data'));
    state.currentIndex = saved.index;
    state.score = saved.score;
    selectGame(saved.game);
    document.getElementById('resume-container').classList.add('hidden');
}

function finishQuiz() {
    localStorage.removeItem('quiz_resume_data');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('final-score').innerText = state.score;
    document.getElementById('final-accuracy').innerText = Math.round((state.score / (state.questions.length * 10)) * 100) + "%";
}

function useHint(type) {
    const q = state.questions[state.currentIndex];
    if(type === '50-50' && state.coins >= 5) {
        state.coins -= 5;
        alert("It's between: " + q.hints['50-50'].join(" and "));
    } else if(type === 'textual' && state.coins >= 3) {
        state.coins -= 3;
        alert("HINT: " + q.hints.textual);
    } else {
        alert("Not enough coins! Watch an ad?");
    }
    updateProfile();
}

function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}
