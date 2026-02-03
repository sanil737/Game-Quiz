let coins = 10;
let score = 0;
let questions = [];
let currentIndex = 0;

// Difficulty Order Logic
const difficultyOrder = { "Very Easy": 1, "Easy": 2, "Normal": 3, "Hard": 4 };

async function startGame(gameName) {
    const user = document.getElementById('username').value;
    if(!user) return alert("Please enter your name!");

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    try {
        // Fetch from the questions folder
        const response = await fetch(`./questions/${gameName}.json`);
        if (!response.ok) throw new Error("File not found");
        
        let data = await response.json();

        // SORT QUESTIONS: Very Easy -> Easy -> Normal -> Hard
        questions = data.sort((a, b) => {
            return (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
        });

        showQuestion();
    } catch (e) {
        console.error(e);
        alert("Error: Make sure 'questions/" + gameName + ".json' exists in your GitHub!");
        location.reload();
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    
    // Display Question and Difficulty
    document.getElementById('question-text').innerText = q.question;
    
    // Modern Difficulty Tag
    const diffTag = document.getElementById('difficulty-tag');
    diffTag.innerText = q.difficulty;
    
    // Color code the difficulty
    if(q.difficulty === "Very Easy") diffTag.style.color = "#00ff88"; // Green
    else if(q.difficulty === "Easy") diffTag.style.color = "#00d4ff"; // Blue
    else if(q.difficulty === "Normal") diffTag.style.color = "#ffcc00"; // Yellow
    else diffTag.style.color = "#ff4444"; // Red

    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn'); // Uses the good design CSS
        btn.innerText = opt;
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
        alert("Wrong! The correct answer was: " + correct);
    }
    
    currentIndex++;
    if(currentIndex < questions.length) {
        showQuestion();
        updateDisplay();
    } else {
        alert("Level Cleared! Your Score: " + score);
        location.reload();
    }
}

function updateDisplay() {
    document.getElementById('coin-count').innerText = coins;
    document.getElementById('score-count').innerText = score;
}

function useHint(type) {
    const q = questions[currentIndex];
    if (type === 'textual' && coins >= 3) {
        coins -= 3;
        alert("HINT: " + q.hints.textual);
    } else if (type === '50-50' && coins >= 5) {
        coins -= 5;
        alert("The answer is one of these: " + q.hints['50-50'].join(" or "));
    } else {
        alert("Not enough coins!");
    }
    updateDisplay();
}
