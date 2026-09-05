/* =====================================================
   MEMORY MATCH
   Memory Card Game
   ===================================================== */


/* ================= DOM ELEMENTS ================= */

const gameBoard = document.getElementById("gameBoard");

const timerElement = document.getElementById("timer");

const movesElement = document.getElementById("moves");

const matchesElement = document.getElementById("matches");

const bestScoreElement =
    document.getElementById("bestScore");

const restartBtn =
    document.getElementById("restartBtn");

const restartTopBtn =
    document.getElementById("restartTopBtn");

const winModal =
    document.getElementById("winModal");

const finalTime =
    document.getElementById("finalTime");

const finalMoves =
    document.getElementById("finalMoves");

const newRecord =
    document.getElementById("newRecord");

const playAgainBtn =
    document.getElementById("playAgainBtn");


/* ================= GAME DATA ================= */

const symbols = [
    "🍕",
    "🚀",
    "🎮",
    "🎧",
    "⚽",
    "🌈",
    "🦄",
    "🔥"
];


let cards = [];

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;

let matches = 0;

let seconds = 0;

let timerInterval = null;

let gameStarted = false;


/* ================= BEST SCORE ================= */

let bestScore =
    localStorage.getItem("memoryBestScore");


if (bestScore) {

    bestScoreElement.textContent =
        `${bestScore} moves`;

}


/* ================= START GAME ================= */

startGame();


/* ================= START GAME FUNCTION ================= */

function startGame() {

    stopTimer();

    resetGameValues();

    createDeck();

    shuffleCards();

    renderCards();

}


/* ================= RESET VALUES ================= */

function resetGameValues() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    moves = 0;

    matches = 0;

    seconds = 0;

    gameStarted = false;

    movesElement.textContent = "0";

    matchesElement.textContent = "0 / 8";

    timerElement.textContent = "00:00";

}


/* ================= CREATE DECK ================= */

function createDeck() {

    cards = [];

    symbols.forEach(symbol => {

        cards.push(symbol);

        cards.push(symbol);

    });

}


/* ================= SHUFFLE ================= */

function shuffleCards() {

    for (
        let i = cards.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            cards[i],
            cards[randomIndex]
        ] =
        [
            cards[randomIndex],
            cards[i]
        ];

    }

}


/* ================= RENDER CARDS ================= */

function renderCards() {

    gameBoard.innerHTML = "";


    cards.forEach((symbol, index) => {

        const card =
            document.createElement("div");


        card.className = "card";

        card.dataset.symbol = symbol;

        card.dataset.index = index;


        card.innerHTML = `

            <div class="card-face card-front"></div>

            <div class="card-face card-back">
                ${symbol}
            </div>

        `;


        card.addEventListener(
            "click",
            flipCard
        );


        gameBoard.appendChild(card);

    });

}


/* ================= FLIP CARD ================= */

function flipCard() {

    if (lockBoard) {
        return;
    }


    if (this === firstCard) {
        return;
    }


    if (this.classList.contains("matched")) {
        return;
    }


    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }


    this.classList.add("flipped");


    if (!firstCard) {

        firstCard = this;

        return;

    }


    secondCard = this;


    moves++;

    movesElement.textContent = moves;


    checkForMatch();

}


/* ================= CHECK MATCH ================= */

function checkForMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    if (isMatch) {

        handleMatch();

    } else {

        handleMismatch();

    }

}


/* ================= MATCH ================= */

function handleMatch() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");


    matches++;

    matchesElement.textContent =
        `${matches} / 8`;


    resetSelection();


    if (matches === symbols.length) {

        gameWon();

    }

}


/* ================= MISMATCH ================= */

function handleMismatch() {

    lockBoard = true;


    setTimeout(() => {

        firstCard.classList.remove("flipped");

        secondCard.classList.remove("flipped");


        resetSelection();

    }, 850);

}


/* ================= RESET SELECTION ================= */

function resetSelection() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* ================= TIMER ================= */

function startTimer() {

    stopTimer();


    timerInterval =
        setInterval(() => {

            seconds++;

            timerElement.textContent =
                formatTime(seconds);

        }, 1000);

}


/* ================= STOP TIMER ================= */

function stopTimer() {

    if (timerInterval) {

        clearInterval(timerInterval);

        timerInterval = null;

    }

}


/* ================= FORMAT TIME ================= */

function formatTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60);

    const remainingSeconds =
        totalSeconds % 60;


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );

}


/* ================= GAME WON ================= */

function gameWon() {

    stopTimer();


    finalTime.textContent =
        formatTime(seconds);


    finalMoves.textContent =
        moves;


    let isNewRecord = false;


    if (
        !bestScore ||
        moves < Number(bestScore)
    ) {

        bestScore = moves;

        localStorage.setItem(
            "memoryBestScore",
            bestScore
        );


        bestScoreElement.textContent =
            `${bestScore} moves`;


        isNewRecord = true;

    }


    if (isNewRecord) {

        newRecord.classList.remove("hidden");

    } else {

        newRecord.classList.add("hidden");

    }


    setTimeout(() => {

        winModal.classList.remove("hidden");

    }, 500);

}


/* ================= RESTART ================= */

restartBtn.addEventListener(
    "click",
    startGame
);


restartTopBtn.addEventListener(
    "click",
    startGame
);


playAgainBtn.addEventListener(
    "click",
    () => {

        winModal.classList.add("hidden");

        startGame();

    }
);


/* ================= KEYBOARD SUPPORT ================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !winModal.classList.contains("hidden")
        ) {

            winModal.classList.add("hidden");

        }

    }
);