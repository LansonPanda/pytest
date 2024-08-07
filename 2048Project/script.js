    let grid = [];
let score = 0;

function initGame() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
    updateGrid();
}

function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    if (emptyCells.length > 0) {
        let {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
        const cellIndex = i * 4 + j;
        const cell = document.querySelectorAll('.cell')[cellIndex];
        cell.classList.add('new-tile');
        setTimeout(() => cell.classList.remove('new-tile'), 300);
    }
}

function updateGrid() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cellIndex = i * 4 + j;
            cells[cellIndex].textContent = grid[i][j] || '';
            cells[cellIndex].style.backgroundColor = getColor(grid[i][j]);
        }
    }
    document.getElementById('score').textContent = score;
}

function getColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
}

function move(direction) {
    let moved = false;
    const newGrid = JSON.parse(JSON.stringify(grid));
    let mergedCells = [];

    if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            let { newRow, mergedIndices } = pushLeft(newGrid[i]);
            newGrid[i] = newRow;
            mergedCells = mergedCells.concat(mergedIndices.map(j => ({i, j})));
        }
    } else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let { newRow, mergedIndices } = pushLeft(newGrid[i].reverse());
            newGrid[i] = newRow.reverse();
            mergedCells = mergedCells.concat(mergedIndices.map(j => ({i, j: 3-j})));
        }
    } else if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            let column = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]];
            let { newRow, mergedIndices } = pushLeft(column);
            for (let i = 0; i < 4; i++) {
                newGrid[i][j] = newRow[i];
            }
            mergedCells = mergedCells.concat(mergedIndices.map(i => ({i, j})));
        }
    } else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
            let column = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]];
            let { newRow, mergedIndices } = pushLeft(column.reverse());
            newRow = newRow.reverse();
            for (let i = 0; i < 4; i++) {
                newGrid[i][j] = newRow[i];
            }
            mergedCells = mergedCells.concat(mergedIndices.map(i => ({i: 3-i, j})));
        }
    }

    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
        moved = true;
        grid = newGrid;
        addNewTile();
        updateGrid();
        
        // Apply merged animation
        mergedCells.forEach(({i, j}) => {
            const cellIndex = i * 4 + j;
            const cell = document.querySelectorAll('.cell')[cellIndex];
            cell.classList.add('merged');
            setTimeout(() => cell.classList.remove('merged'), 200);
        });
    }

    if (isGameOver()) {
        alert('게임 오버!');
    }
}

function pushLeft(row) {
    let newRow = row.filter(cell => cell !== 0);
    let mergedIndices = [];
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
            mergedIndices.push(i);
        }
    }
    while (newRow.length < 4) {
        newRow.push(0);
    }
    return { newRow, mergedIndices };
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
            if (i < 3 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }
            if (j < 3 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
        }
    }
    return true;
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
});

initGame();