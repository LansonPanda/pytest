const boardSize = 19; // 오목판 크기
const boardElement = document.querySelector('.board');

// Create cells for the board
for (let i = 0; i < boardSize * boardSize; i++) {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    boardElement.appendChild(cellElement);
}

const cellSize = 32; // New size of each cell
const boardOffset = 20; // Offset from the board edge

// Function to update clicked cell coordinates
function updateClickedCell(event) {
    const x = Math.floor((event.clientX - boardOffset) / cellSize);
    const y = Math.floor((event.clientY - boardOffset) / cellSize);
    const coordinatesElement = document.querySelector('.clicked-cell');
    coordinatesElement.innerText = `(${x}, ${y})`;
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

// Handle cell hover
function handleCellHover(event) {
    const x = Math.floor((event.clientX - boardOffset) / cellSize);
    const y = Math.floor((event.clientY - boardOffset) / cellSize);

    // Remove existing example stones
    const existingExamples = document.querySelectorAll('.example-stone');
    existingExamples.forEach(example => example.remove());

    // Show example stone
    if (board[y][x] === '') {
        const cell = document.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`);
        const exampleStone = document.createElement('div');
        exampleStone.classList.add('example-stone');
        exampleStone.style.opacity = '0.5'; // Set opacity for example stone
        cell.appendChild(exampleStone);
    }
}



/*
// Update cell size and calculate grid center coordinates
const cellSize = 32; // New size of each cell
const boardOffset = 20; // Offset from the board edge

// Function to update clicked cell coordinates
function updateClickedCell(event) {
    const x = Math.floor((event.clientX - boardOffset) / cellSize);
    const y = Math.floor((event.clientY - boardOffset) / cellSize);
    const coordinatesElement = document.querySelector('.clicked-cell');
    coordinatesElement.innerText = `(${x}, ${y})`;
}

// Function to update hovered cell coordinates
function updateHoveredCell(event) {
    const x = Math.floor((event.clientX - boardOffset) / cellSize);
    const y = Math.floor((event.clientY - boardOffset) / cellSize);
    const coordinatesElement = document.querySelector('.hovered-cell');
    coordinatesElement.innerText = `(${x}, ${y})`;
}

// Add click event listener to update coordinates
document.querySelector('.board').addEventListener('click', updateClickedCell);

// Add mouseover event listener to update coordinates
document.querySelector('.board').addEventListener('mouseover', updateHoveredCell);

// Add mouseout event listener to clear coordinates when not hovering
document.querySelector('.board').addEventListener('mouseout', () => {
    const coordinatesElement = document.querySelector('.hovered-cell');
    coordinatesElement.innerText = '';
});
*/


