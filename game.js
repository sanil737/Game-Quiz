let coins = 10;
let score = 0;
let questions = [];
let currentIndex = 0;

// CHECK FOR SAVED NAME ON PAGE LOAD
window.onload = function() {
    const savedName = localStorage.getItem('quiz_username');
    if (savedName) {
        document.getElementById('username').value = savedName;
        showWelcome(savedName);
    }
};

function showWelcome(name) {
    const setup = document.getElementById('setup-screen');
    // Add a welcome message if name is already there
    let msg = document.querySelector('.welcome-msg');
    if(!msg) {
        msg = document.createElement('div');
        msg.className = 'welcome-msg';
        setup.prepend(msg);
    }
    msg.innerText = "Welcome back, " + name + "!";
}

async function startGame(gameName) {
    const nameInput = document.getElementById('username').value;
    if(!nameInput) return alert("Please enter your name!");

    // SAVE NAME PERMANENTLY
    localStorage.setItem('quiz_username', nameInput);

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    try {
        const response = await fetch(`./questions/${gameName}.json`);
        questions = await response.json();
        showQuestion();
    } catch (e) {
        alert("JSON not found! Check your folder.");
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    // Set Question
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('difficulty-tag').innerText = q.difficulty;

    // Option Labels (A, B, C, D)
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
        score += 10; coins += 1;
        alert("Correct! 🎉");
    } else {
        alert("Wrong! Correct: " + correct);
    }
    
    currentIndex++;
    if(currentIndex < questions.length) {
        showQuestion();
        updateDisplay();
    } else {
        alert("Finished! Score: " + score);
        location.reload();
    }
}

function updateDisplay() {
    document.getElementById('coin-count').innerText = coins;
    document.getElementById('score-count').innerText = score;
}
