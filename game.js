let coins = 10;
let score = 0;
let questions = [];
let currentIndex = 0;

async function startGame(gameName) {
    const user = document.getElementById('username').value;
    if(!user) return alert("Please enter your name!");

    // Hide setup, show quiz
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    // Fetch questions from your repo
    try {
        const response = await fetch(`./questions/${gameName}.json`);
        questions = await response.json();
        showQuestion();
    } catch (e) {
        alert("Error loading questions. Make sure the JSON files exist in /questions folder.");
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('difficulty-tag').innerText = `Difficulty: ${q.difficulty}`;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, q.answer);
        container.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if(selected === correct) {
        score += 10;
        coins += 1;
        alert("Correct! +1 Coin");
    } else {
        alert("Wrong! The answer was: " + correct);
    }
    
    currentIndex++;
    if(currentIndex < questions.length) {
        showQuestion();
        updateDisplay();
    } else {
        alert("Quiz Finished! Final Score: " + score);
        location.reload(); // Restart
    }
}

function updateDisplay() {
    document.getElementById('coin-count').innerText = coins;
    document.getElementById('score-count').innerText = score;
}
