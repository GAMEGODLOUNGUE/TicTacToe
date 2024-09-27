const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const aiButton = document.getElementById('aiButton');
let oTurn;
let isAI = false;

twoPlayerButton.addEventListener('click', () => {
    isAI = false;
    startGame();
});

aiButton.addEventListener('click', () => {
    isAI = true;
    startGame();
});

restartButton.addEventListener('click', resetGame);

// Initialize the game
function startGame() {
    oTurn = false;
    board.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    statusText.innerText = "Player X's turn";
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS);
        cell.innerText = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    removeWinningLine();
}

// Handle click events
function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false, currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setStatusMessage();

        if (isAI && oTurn) {
            aiTurn();
        }
    }
}

// AI's turn
function aiTurn() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });

    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        const currentClass = O_CLASS; // AI is O
        placeMark(randomCell, currentClass);

        if (checkWin(currentClass)) {
            endGame(false, currentClass);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setStatusMessage();
        }
    }
}

// Reset the game
function resetGame() {
    startGame();
}

// End the game and show the winner
function endGame(draw, currentClass) {
    if (draw) {
        statusText.innerText = "It's a draw!";
    } else {
        statusText.innerText = `${currentClass === X_CLASS ? "X" : "O"} wins!`;
        disableBoard(); // Disable further moves
        drawWinningLine(currentClass); // Draw the winning line
    }
}

// Disable all cells from being clickable
function disableBoard() {
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

// Draw a line on the winning combination
function drawWinningLine(currentClass) {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
    
    if (winningCombination) {
        const line = document.createElement('div');
        line.classList.add('winning-line');
        const firstCell = cellElements[winningCombination[0]].getBoundingClientRect();
        const lastCell = cellElements[winningCombination[2]].getBoundingClientRect();
        
        // Calculate position and dimensions for the line
        line.style.width = (lastCell.right - firstCell.left) + 'px';
        line.style.left = firstCell.left + 'px';
        line.style.top = firstCell.top + (firstCell.height / 2) + 'px';
        
        board.appendChild(line);
    }
}

// Remove any existing winning line
function removeWinningLine() {
    const line = document.querySelector('.winning-line');
    if (line) {
        line.remove();
    }
}

// Check for a draw condition
function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Place mark in the cell
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerText = currentClass === X_CLASS ? 'X' : 'O'; // Display the current player’s mark
}

// Swap turns
function swapTurns() {
    oTurn = !oTurn;
}

// Set the status message
function setStatusMessage() {
    statusText.innerText = `Player ${oTurn ? "O" : "X"}'s turn`;
}

// Check for win condition
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
