const boardSize = 19;
let currentPlayer = 'black'; // 'black' starts the game
let board = [];

// Initialize the board
for (let i = 0; i < boardSize; i++) {
    board.push(Array(boardSize).fill(''));
}

const boardElement = document.querySelector('.board');

// Create the board UI
for (let i = 0; i < boardSize; i++) {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    for (let j = 0; j < boardSize; j++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.row = i;
        cellElement.dataset.col = j;
        cellElement.addEventListener('click', handleCellClick);
        rowElement.appendChild(cellElement);
    }
    boardElement.appendChild(rowElement);
}

// Handle cell hover
function handleCellHover(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    // Remove existing example stones
    const existingExamples = document.querySelectorAll('.example-stone');
    existingExamples.forEach(example => example.remove());

    // Show example stone
    if (board[row][col] === '') {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const exampleStone = document.createElement('div');
        exampleStone.classList.add('example-stone');
        exampleStone.classList.add(currentPlayer);
        cell.appendChild(exampleStone);
    }

    // 로그출력
    console.log(`row: ${row}, col: ${col}`);
}

// Add cell hover event listener
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('mouseover', handleCellHover);
    cell.addEventListener('mouseout', () => {
        const existingExamples = document.querySelectorAll('.example-stone');
        existingExamples.forEach(example => example.remove());
    });
});

// Check if the current player wins
function checkWin(row, col) {
    const directions = [
        [0, 1],   // Right
        [1, 0],   // Down
        [1, 1],   // Diagonal down-right
        [-1, 1]   // Diagonal down-left
    ];

    for (let [dx, dy] of directions) {
        let count = 1;
        let r = row + dx;
        let c = col + dy;

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === currentPlayer) {
            count++;
            r += dx;
            c += dy;
        }

        r = row - dx;
        c = col - dy;

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === currentPlayer) {
            count++;
            r -= dx;
            c -= dy;
        }

        if (count >= 5) {
            return true;
        }
    }

    return false;
}


// Reset the board
function resetBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(''));
    currentPlayer = 'black';
    const stones = document.querySelectorAll('.stone');
    stones.forEach(stone => stone.remove());
}

// Add cell hover event listener
cells.forEach(cell => {
    cell.addEventListener('mouseover', handleCellHover);
    cell.addEventListener('mouseout', () => {
        const existingExamples = document.querySelectorAll('.example-stone');
        existingExamples.forEach(example => example.remove());
    });
});

// Create turn indicator element
const turnIndicator = document.createElement('div');
turnIndicator.classList.add('turn-indicator');
turnIndicator.textContent = `Current turn: ${currentPlayer}`;

// Add turn indicator below the board
boardElement.parentNode.insertBefore(turnIndicator, boardElement.nextSibling);

// Update turn indicator
function updateTurnIndicator() {
    turnIndicator.textContent = `Current turn: ${currentPlayer}`;
}

// Handle cell click
function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        const cell = event.target;
        const stone = document.createElement('div');
        stone.classList.add(currentPlayer);
        stone.classList.add('stone');
        cell.appendChild(stone);
        if (checkWin(row, col)) {
            alert(`${currentPlayer} wins!`);
            resetBoard();
        } else {
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            updateTurnIndicator(); // Update turn indicator
        }
    }
}

// Hide cursor when hovering over the board
boardElement.addEventListener('mouseover', () => {
    document.body.style.cursor = 'none';
});

// Show cursor when leaving the board
boardElement.addEventListener('mouseout', () => {
    document.body.style.cursor = 'default';
});
