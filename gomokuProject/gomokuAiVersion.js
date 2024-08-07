const bs = 15;
let cp = 'black';
let board = Array.from({ length: bs }, () => Array(bs).fill(''));

const be = document.querySelector('.board');
const ti = document.createElement('div');
let count = 0;

function cbd() {
    const fg = document.createDocumentFragment();
    for (let i = 0; i < bs; i++) {
        const re = document.createElement('div');
        re.className = 'row';
        for (let j = 0; j < bs; j++) {
            const ce = document.createElement('div');
            ce.className = 'cell';
            ce.dataset.row = i;
            ce.dataset.col = j;
            re.appendChild(ce);
        }
        fg.appendChild(re);
    }
    be.appendChild(fg);
}

function hch(event) {
    const { row, col } = event.target.dataset;
    if (board[row][col] === '') {
        const es = document.createElement('div');
        es.className = `example-stone ${cp}`;
        event.target.appendChild(es);
    }
}

function handleCellOut(event) {
    const es = event.target.querySelector('.example-stone');
    if (es) es.remove();
}

function ckw(row, col) {
    const dc = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    return dc.some(([dx, dy]) => {
        let ct = 1;
        for (let i = 1; i <= 4; i++) {
            const r = row + dx * i, c = col + dy * i;
            if (ivc(r, c) && board[r][c] === cp) ct++;
            else break;
        }
        for (let i = 1; i <= 4; i++) {
            const r = row - dx * i, c = col - dy * i;
            if (ivc(r, c) && board[r][c] === cp) ct++;
            else break;
        }
        return ct === 5;
    });
}

function ivc(row, col) {
    return row >= 0 && row < bs && col >= 0 && col < bs;
}

function rsb() {
    board = Array.from({ length: bs }, () => Array(bs).fill(''));
    cp = 'black';
    be.querySelectorAll('.stone').forEach(stone => stone.remove());
    uti();
}

function uti() {
    ti.textContent = `Current turn: ${cp}`;
}


function cpf(row, col, player) {
    const dc = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    let pf = 0;

    for (const [dx, dy] of dc) {
        let se = '';
        for (let i = -4; i <= 4; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (!ivc(r, c)) {
                se += 'x';  // 경계 밖
            } else if (r === row && c === col) {
                se += 'o';  // 현재 위치
            } else if (board[r][c] === player) {
                se += 'o';  // 자신의 돌
            } else if (board[r][c] === '') {
                se += '.';  // 빈 칸
            } else {
                se += 'x';  // 상대방 돌
            }
        }
        if (se.includes('oooo') || 
            se.includes('ooo.o') ||
            se.includes('ooo..o') ||
            se.includes('oo.o.o') ||
            se.includes('oo..oo') ||
            se.includes('o.ooo') ||
            se.includes('o.oo.o') ||
            se.includes('o.o.oo') ||
            se.includes('o..ooo') ||
            se.includes('ooo.o') ||
            se.includes('oo.oo')) {
            pf++;
        } else if(se.includes('.o.ooo.o.') ||
            se.includes('oo.oo.oo')) {
            pf = 2;
        } else if (se.includes('oooooo')) {
            pf = 6;
        }
    }
    return pf;
}

function cpt(row, col, player) {
    const dc = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    let pt = 0;

    for (const [dx, dy] of dc) {
        let se = '';
        for (let i = -4; i <= 4; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (!ivc(r, c)) {
                se += 'x';  // 경계 밖
            } else if (r === row && c === col) {
                se += 'o';  // 현재 위치
            } else if (board[r][c] === player) {
                se += 'o';  // 자신의 돌
            } else if (board[r][c] === '') {
                se += '.';  // 빈 칸
            } else {
                se += 'x';  // 상대방 돌
            }
        }

        if (se.includes('.ooo.') || 
            se.includes('.oo.o.') ||
            se.includes('.o.oo.')) {
            pt++;
        }
    }   

    return pt;
}

function ivm(row, col, player) {
    if (player === 'black') {
        board[row][col] = 'black';
        const pt = cpt(row, col, 'black');
        const pf = cpf(row, col, 'black');
        board[row][col] = ''; // 원상복구

        if (pt >= 2) {
            alert("3-3 금수입니다. 다른 곳에 돌을 놓아주세요.");
            return false;
        } else if(pf === 6) { 
            alert("장목 금수입니다. 다른 곳에 돌을 놓아주세요.");
            return false;
        } else if (pf >=2 ) {
            alert("4-4 금수입니다. 다른 곳에 돌을 놓아주세요.");
            return false;
        
        }
    }
    return true;
}

function handleAITurn() {
    const aiMovePos = aiMove();
    makeMove(aiMovePos.row, aiMovePos.col);
    
    if (ckw(aiMovePos.row, aiMovePos.col)) {
        alert(`${cp} wins!`);
        rsb();
    } else {
        cp = 'black';
        uti();
    }
}

function hcc(event) {
    const row = Number(event.target.dataset.row);
    const col = Number(event.target.dataset.col);
    if (board[row][col] === '' && ivm(row, col, 'black')) {
        makeMove(row, col);
        
        if (ckw(row, col)) {
            alert(`${cp} wins!`);
            rsb();
        } else {
            cp = 'white';
            uti();
            
            // AI 차례
            setTimeout(handleAITurn, 500);
        }
    } else if (!ivm(row, col, 'black')) {
        alert("금수입니다. 다른 곳에 돌을 놓아주세요.");
    }
}

function ing() {
    cbd();
    ti.className = 'turn-indicator';
    uti();
    be.parentNode.insertBefore(ti, be.nextSibling);

    be.addEventListener('click', hcc);

    be.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('cell')) hch(e);
    });
    be.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('cell')) handleCellOut(e);
    });
}

function minimax(depth, alpha, beta, isMaximizing, lastMove) {
    if (depth === 0 || checkGameEnd()) {
        return evaluateBoard(lastMove);
    }

    const promisingMoves = getPromisingStonesPositions();

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const {i, j} of promisingMoves) {
            if (board[i][j] === '') {
                board[i][j] = 'white';
                let eval = minimax(depth - 1, alpha, beta, false, {row: i, col: j});
                board[i][j] = '';
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const {i, j} of promisingMoves) {
            if (board[i][j] === '' /*&& ivm(i, j, 'black')*/) {
                board[i][j] = 'black';
                let eval = minimax(depth - 1, alpha, beta, true, {row: i, col: j});
                board[i][j] = '';
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
        }
        return minEval;
    }
}

function aiMove() {
    const threatResponse = detectAndRespondToThreats();

    let bestScore = -Infinity;
    let bestMove;
    const depth = 2;
    const promisingMoves = getPromisingStonesPositions();

    const bestMoves = new Array();

    bestMoves.length = 0;

    for (const {i, j} of promisingMoves) {
        console.log("prom current: ", i, j);
        if (board[i][j] === '') {
            board[i][j] = 'white';
            let score = minimax(depth - 1, -Infinity, Infinity, false, {row: i, col: j});
            board[i][j] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = { row: i, col: j };
                bestMoves.push({i, j});
                
            }
        }
    }

    //console.log(bestScore);
    //if (bestScore > 19000) {
    //    console.log('winning move');
    //    // bestMoves 중 랜덤으로 return
    //    return bestMove;
    //}

    if (threatResponse) {
        console.log('threat move');
        return threatResponse;
    }

    const randomIndex = Math.floor(Math.random() * bestMoves.length);
    bestMove = { row: bestMoves[randomIndex].i, col: bestMoves[randomIndex].j };

    console.log(bestMoves);
    console.log(bestMove);
    console.log('best move');

    return bestMove;
}

function detectAndRespondToThreats() {
    // 승리 위협 감지 및 대응
    const winThreat = detectWinThreat('black');
    if (winThreat) return winThreat;

    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];

    // 1,2,3,4 중 랜덤으로 저장하는 변수
    let random = Math.floor(Math.random() * 4);
    console.log("ranmdom : " + random);
    if (random === 0) {
        for (let i = 0; i < bs; i++) {
            for (let j = 0; j < bs; j++) {
                if (board[i][j] === '') {
                    for (const [dx, dy] of directions) {
                        const sequence = getSequence(i, j, dx, dy, 'black');
                        if (sequence.includes('.oooo.')) {
                            console.log("detected loose");  
                            return {row: i, col: j};
                        } else if (sequence.includes('oooo.') || 
                        sequence.includes('.oooo') || 
                        sequence.includes('oooo') ||
                        sequence.includes('ooo.o') ||
                        sequence.includes('ooo..o') ||
                        sequence.includes('oo.o.o') ||
                        sequence.includes('oo..oo') ||
                        sequence.includes('o.ooo') ||
                        sequence.includes('o.oo.o') ||
                        sequence.includes('o.o.oo') ||
                        sequence.includes('o..ooo') ||
                        sequence.includes('oo.oo')) {
                            console.log("detected quad");
                            return {row: i, col: j};
                        } else if (sequence.includes('.ooo.') || 
                            sequence.includes('.o.oo.') ||   
                            sequence.includes('.oo.o.')) {
                            console.log("detected tri");
                            return {row: i, col: j};
                        }
                    }
                }
            }
        }
        return null;
    } else if (random === 1) {
        for (let i = 0; i < bs; i++) {
            for (let j = bs-1; j >= 0; j--) {
                if (board[i][j] === '') {
                    for (const [dx, dy] of directions) {
                        const sequence = getSequence(i, j, dx, dy, 'black');
                        if (sequence.includes('.oooo.')) {
                            console.log("detected loose");  
                            return {row: i, col: j};
                        } else if (sequence.includes('oooo.') || 
                        sequence.includes('.oooo') || 
                        sequence.includes('oooo') ||
                        sequence.includes('ooo.o') ||
                        sequence.includes('ooo..o') ||
                        sequence.includes('oo.o.o') ||
                        sequence.includes('oo..oo') ||
                        sequence.includes('o.ooo') ||
                        sequence.includes('o.oo.o') ||
                        sequence.includes('o.o.oo') ||
                        sequence.includes('o..ooo') ||
                        sequence.includes('oo.oo')) {
                            console.log("detected quad");
                            return {row: i, col: j};
                        } else if (sequence.includes('.ooo.') || 
                            sequence.includes('.o.oo.') ||   
                            sequence.includes('.oo.o.')) {
                            console.log("detected tri");
                            return {row: i, col: j};
                        }
                    }
                }
            }
        }
        return null;
    } else if (random === 2) {
        for (let i = bs-1; i >= 0; i--) {
            for (let j = 0; j < bs; j++) {
                if (board[i][j] === '') {
                    for (const [dx, dy] of directions) {
                        const sequence = getSequence(i, j, dx, dy, 'black');
                        if (sequence.includes('.oooo.')) {
                            console.log("detected loose");  
                            return {row: i, col: j};
                        } else if (sequence.includes('oooo.') || 
                        sequence.includes('.oooo') || 
                        sequence.includes('oooo') ||
                        sequence.includes('ooo.o') ||
                        sequence.includes('ooo..o') ||
                        sequence.includes('oo.o.o') ||
                        sequence.includes('oo..oo') ||
                        sequence.includes('o.ooo') ||
                        sequence.includes('o.oo.o') ||
                        sequence.includes('o.o.oo') ||
                        sequence.includes('o..ooo') ||
                        sequence.includes('oo.oo')) {
                            console.log("detected quad");
                            return {row: i, col: j};
                        } else if (sequence.includes('.ooo.') || 
                            sequence.includes('.o.oo.') ||   
                            sequence.includes('.oo.o.')) {
                            console.log("detected tri");
                            return {row: i, col: j};
                        }
                    }
                }
            }
        }
        return null;
    } else if (random === 3) {
        for (let i = bs-1; i >= 0; i--) {
            for (let j = bs-1; j >= 0; j--) {
                if (board[i][j] === '') {
                    for (const [dx, dy] of directions) {
                        const sequence = getSequence(i, j, dx, dy, 'black');
                        if (sequence.includes('.oooo.')) {
                            console.log("detected loose");  
                            return {row: i, col: j};
                        } else if (sequence.includes('oooo.') || 
                        sequence.includes('.oooo') || 
                        sequence.includes('oooo') ||
                        sequence.includes('ooo.o') ||
                        sequence.includes('ooo..o') ||
                        sequence.includes('oo.o.o') ||
                        sequence.includes('oo..oo') ||
                        sequence.includes('o.ooo') ||
                        sequence.includes('o.oo.o') ||
                        sequence.includes('o.o.oo') ||
                        sequence.includes('o..ooo') ||
                        sequence.includes('oo.oo')) {
                            console.log("detected quad");
                            return {row: i, col: j};
                        } else if (sequence.includes('.ooo.') || 
                            sequence.includes('.o.oo.') ||   
                            sequence.includes('.oo.o.')) {
                            console.log("detected tri");
                            return {row: i, col: j};
                        }
                    }
                }
            }
        }
        return null;
    }
}

function detectWinThreat(player) {
    for (let i = 0; i < bs; i++) {
        for (let j = 0; j < bs; j++) {
            if (board[i][j] === '') {
                board[i][j] = player;
                if (ckw(i, j)) {
                    board[i][j] = '';
                    return {row: i, col: j};
                }
                board[i][j] = '';
            }
        }
    }
    return null;
}

function findBestMove(depth) {
    let bestScore = -Infinity;
    let bestMove;
    const promisingMoves = getPromisingStonesPositions();

    for (const {i, j} of promisingMoves) {
        board[i][j] = 'white';
        let score = minimax(depth - 1, -Infinity, Infinity, false);
        board[i][j] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
        }
    }

    return bestMove;
}

function getPromisingStonesPositions() {
    const positions = [];
    for (let i = 0; i < bs; i++) {
        for (let j = 0; j < bs; j++) {
            if (board[i][j] === '' && hasNeighbor(i, j)) {
                positions.push({i, j});
            }
        }
    }
    return positions;
}

function hasNeighbor(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < bs && newCol >= 0 && newCol < bs && board[newRow][newCol] !== '') {
                return true;
            }
        }
    }
    return false;
}

// 보드 평가 함수
function evaluateBoard(lastMove) {
    let score = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    
    for (let d = 0; d < directions.length; d++) {
        const [dx, dy] = directions[d];
        for (let i = -4; i <= 4; i++) {
            const row = lastMove.row + dx * i;
            const col = lastMove.col + dy * i;
            if (ivc(row, col)) {
                score += evaluatePosition(row, col, board[row][col]);
            }
        }
    }
    return score;
}

function evaluateDirection(row, col, dx, dy, player) {
    const sequence = getSequence(row, col, dx, dy, player);
    return evaluateSequence(sequence, player);
}
function evaluatePosition(row, col, player) {
    let score = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];

    for (const [dx, dy] of directions) {
        let sequence = getSequence(row, col, dx, dy, player);
        score += evaluateSequence(sequence, player);
    }
    
    return score;
}

function getSequence(row, col, dx, dy, player) {
    let se = '';
    for (let i = -4; i <= 4; i++) {
        const r = row + dx * i;
        const c = col + dy * i;
        if (!ivc(r, c)) {
            se += 'x';  // 경계 밖
        } else if (board[r][c] === player) {
            se += 'o';  // 자신의 돌
        } else if (board[r][c] === '') {
            se += '.';  // 빈 칸
        } else {
            se += 'x';  // 상대방 돌
        }
    }
    return se;
}

function evaluateSequence(sequence, player) {
    const patterns = {
        'ooooo': 1000,  // 승리
        '.oooo.': 500,  // 열린 4
        'xoooo.': 301,  // 한쪽 막힌 4
        '.oooox': 300,
        '.ooo.': 150,    // 열린 3
        'xooo.': 101,   // 한쪽 막힌 3
        '..ooox': 100,
        '.oo.': 60,      // 열린 2
        'xoo.': 41,    // 한쪽 막힌 2
        '.oox': 40,
        '.o.': 20,        // 열린 1
        'xo.': 11,     // 한쪽 막힌 1
        '.ox': 10
    };

    let score = 0;
    for (const [pattern, value] of Object.entries(patterns)) {
        const regex = new RegExp(pattern.replace(/o/g, player === 'white' ? 'o' : 'b'), 'g');
        const matches = (sequence.match(regex) || []).length;
        score += value * matches;
    }

    return score;
}
// 돌을 놓는 함수
function makeMove(row, col) {
    board[row][col] = cp;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const stone = document.createElement('div');
    stone.className = `stone ${cp}`;
    cell.appendChild(stone);
}

function checkGameEnd() {
    // 승리 조건 확인
    for (let i = 0; i < bs; i++) {
        for (let j = 0; j < bs; j++) {
            if (board[i][j] !== '' && ckw(i, j)) {
                return true;
            }
        }
    }
    
    // 무승부 조건 확인 (보드가 가득 찼는지)
    return board.every(row => row.every(cell => cell !== ''));
}

ing();