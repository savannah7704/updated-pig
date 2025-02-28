let scores = { // object that initializes scores
    playerRoll: 0,
    playerTotalScore: 0,
    playerCurrentScore: 0,
    compRoll: 0,
    compTotalScore: 0,
    compCurrentScore: 0,
};

async function onLoadRoll() {
    await wakeUpServer()
    scores.playerCurrentScore = await rollDie(true);
    scores.playerRoll = scores.playerCurrentScore;
    updateScores();
}

async function wakeUpServer() {
    try {
        await fetch('https://node-and-express-on-azure-template-ss-c7dufvgra7gbgte9.centralus-01.azurewebsites.net/roll', { method: 'GET' });
    } catch (error) {
        console.error("Error waking up server:", error);
    }
}

async function playerTurn() {
    const roll = await rollDie();
    if (roll === 1) {
        scores.playerCurrentScore = 0;
        updateScores();
        disablePlayerButtons();
        computerTurn();
    } else {
        scores.playerCurrentScore += roll;
        updateScores();
    }
}

async function computerTurn() {
    let choice = Math.floor(Math.random() * 5);
    while (choice !== 0) {
        const roll = await rollDie(false, false);
        if (roll === 1) {
            scores.compCurrentScore = 0;
            updateScores();
            enablePlayerButtons();
            return;
        } else {
            scores.compCurrentScore += roll;
            updateScores();
        }
        choice = Math.floor(Math.random() * 5);
    }

    scores.compTotalScore += scores.compCurrentScore;
    scores.compCurrentScore = 0;
    updateScores();
    checkWinner();
    enablePlayerButtons();
}

async function rollDie(initialRoll = false, isPlayer = true) {
    try {
        const response = await fetch('https://node-and-express-on-azure-template-ss-c7dufvgra7gbgte9.centralus-01.azurewebsites.net/roll');
        const data = await response.json();
        const roll = data.roll;

        if (initialRoll) {
            return roll;
        } else {
            if (roll === 1) {
                if (isPlayer) {
                    scores.playerCurrentScore = 0;
                    scores.playerRoll = roll;
                    updateScores();
                } else {
                    scores.compCurrentScore = 0;
                    scores.compRoll = roll;
                    updateScores();
                }
            } else {
                if (isPlayer) {
                    scores.playerCurrentScore += roll;
                    scores.playerRoll = roll;
                    updateScores();
                } else {
                    scores.compCurrentScore += roll;
                    scores.compRoll = roll;
                    updateScores();
                }
            }
            return roll;
        }
    } catch (error) {
        console.error('Error:', error);
        return 1; // Fallback value in case of error
    }
}

async function hold() {
    scores.playerTotalScore += scores.playerCurrentScore;
    scores.playerCurrentScore = 0;
    updateScores();
    checkWinner();
    disablePlayerButtons();
    computerTurn();
}

function checkWinner() {
    if (scores.playerTotalScore >= 100) {
        alert("YOU WIN!!!!!");
        reset();
    } else if (scores.compTotalScore >= 100) {
        alert("Sorry, YOU LOSE!!!!!");
        reset();
    }
}

function disablePlayerButtons() {
    document.getElementById("roll").disabled = true;
    document.getElementById("hold").disabled = true;
}

function enablePlayerButtons() {
    document.getElementById("roll").disabled = false;
    document.getElementById("hold").disabled = false;
}

function updateScores() {
    document.getElementById("your-roll").innerText = scores.playerRoll;
    document.getElementById("your-current-score").innerText = scores.playerCurrentScore;
    document.getElementById("your-total-score").innerText = scores.playerTotalScore;
    document.getElementById("computer-roll").innerText = scores.compRoll;
    document.getElementById("computer-current-score").innerText = scores.compCurrentScore;
    document.getElementById("computer-total-score").innerText = scores.compTotalScore;
}

function reset() {
    scores = {
        playerRoll: 0,
        playerTotalScore: 0,
        playerCurrentScore: 0,
        compRoll: 0,
        compTotalScore: 0,
        compCurrentScore: 0,
    };
    updateScores();
    enablePlayerButtons();
}
