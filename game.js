let coins = localStorage.getItem('total_coins') ? parseInt(localStorage.getItem('total_coins')) : 10;
let score = 0;
let questions = [];
let currentIndex = 0;

// Update profile on load
window.onload = function() {
    const savedName = localStorage.getItem('quiz_username');
    if (savedName) {
        document.getElementById('username').value = savedName;
        updateProfileUI(savedName);
    }
    updateDisplay();
};

function updateProfileUI(name) {
    document.getElementById('display-name').innerText = name;
    document.getElementById('avatar-init').innerText = name.charAt(0).toUpperCase();
}

async function startGame(gameName) {
    const nameInput = document.getElementById('username').value;
    if(!nameInput) return alert("Enter Name!");

    localStorage.setItem('quiz_username', nameInput);
    updateProfileUI(nameInput);

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    try {
        const response = await fetch(`./questions/${gameName}.json`);
        questions = await response.json();
        showQuestion();
    } catch (e) {
        alert("Error: Check if questions/" + gameName + ".json exists!");
        location.reload();
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('difficulty-tag').innerText = "LEVEL: " + q.difficulty;

    const container = document.getElementById('options-container');
    container.innerHTML = '';
    const labels = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, index) => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-label">${labels[index]}:</span> ${opt}`;
        btn.onclick = () => checkAnswer(opt, q.answer);
        container.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if(selected === correct) {
        score += 10;
        coins += 1;
        alert("Correct! 🎉");
    } else {
        alert("Wrong! Answer was: " + correct);
    }
    
    // Save coins to profile
    localStorage.setItem('total_coins', coins);
    updateDisplay();

    currentIndex++;
    if(currentIndex < questions.length) {
        showQuestion();
    } else {
        alert("Game Complete! Final Score: " + score);
        location.reload();
    }
}

function updateDisplay() {
    document.getElementById('coin-count').innerText = coins;
}

function useHint(type) {
    const q = questions[currentIndex];
    if (type === '50-50' && coins >= 5) {
        coins -= 5;
        alert("Options: " + q.hints['50-50'].join(" or "));
    } else if (type === 'textual' && coins >= 3) {
        coins -= 3;
        alert("Hint: " + q.hints.textual);
    } else {
        alert("Not enough coins!");
    }
    localStorage.setItem('total_coins', coins);
    updateDisplay();
        }
