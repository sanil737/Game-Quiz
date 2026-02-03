let currentQuestions = [];
let currentIndex = 0;
let userCoins = 10;
let userName = "";

async function startQuiz(gameName) {
    userName = document.getElementById('name-input').value;
    if(!userName) return alert("Enter Name");

    const response = await fetch(`http://localhost:5000/api/questions/${gameName}`);
    currentQuestions = await response.json();
    
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('question-text').innerText = q.question;
    // Render options and hint buttons...
}

function useHint(type) {
    const q = currentQuestions[currentIndex];
    const cost = q.hints[type].cost;

    if (userCoins >= cost) {
        userCoins -= cost;
        updateCoinDisplay();
        
        if (type === '50-50') {
            // Logic to hide 2 wrong options
        } else if (type === 'textual') {
            alert(q.hints.textual.hint);
        }
    } else {
        alert("Not enough coins! Watch an ad?");
    }
}

// Interstitial Ad Logic
function handleNextQuestion() {
    currentIndex++;
    if (currentIndex % 10 === 0) {
        showInterstitialAd();
    }
    showQuestion();
}

function showInterstitialAd() {
    console.log("AdSense Interstitial Triggered");
    // If using AdSense: (adsbygoogle = window.adsbygoogle || []).push({});
}
