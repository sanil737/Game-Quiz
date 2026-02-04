const usernameInput = document.getElementById("username-input");
const statusText = document.getElementById("status-text");
const gameCards = document.querySelectorAll(".game-card");

const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");

const questionText = document.getElementById("question-text");
const optionButtons = document.querySelectorAll(".option");

const playerNameText = document.getElementById("player-name");
const coinsText = document.getElementById("coins");

let coins = 5;
let correctAnswer = 3;

// SAMPLE QUESTION
const question = {
  text: "What is the maximum number of players in a classic Battle Royale match?",
  options: ["40", "50", "60", "100"],
  answer: 3,
  hint: "It is a three-digit number."
};

// Unlock games when name entered
usernameInput.addEventListener("input", () => {
  if (usernameInput.value.trim().length > 0) {
    statusText.textContent = "Missions unlocked ✔";
    gameCards.forEach(card => {
      card.classList.remove("locked");
      card.classList.add("unlocked");
      card.onclick = () => startGame();
    });
  }
});

function startGame() {
  homeScreen.classList.remove("active");
  quizScreen.classList.add("active");

  playerNameText.textContent = usernameInput.value;
  loadQuestion();
}

function loadQuestion() {
  questionText.textContent = question.text;
  optionButtons.forEach((btn, i) => {
    btn.textContent = question.options[i];
    btn.className = "option";
    btn.disabled = false;
  });
}

function selectAnswer(index) {
  optionButtons[index].classList.add(
    index === question.answer ? "correct" : "wrong"
  );
}

function use5050() {
  if (coins < 5) return alert("Not enough coins");
  coins -= 5;
  coinsText.textContent = `💰 ${coins}`;

  let removed = 0;
  optionButtons.forEach((btn, i) => {
    if (i !== question.answer && removed < 2) {
      btn.textContent = "";
      btn.disabled = true;
      removed++;
    }
  });
}

function useHint() {
  if (coins < 3) return alert("Not enough coins");
  coins -= 3;
  coinsText.textContent = `💰 ${coins}`;
  alert(question.hint);
}
