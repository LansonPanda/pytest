const bs = 15;
let cp = 'black';
let board = Array.from({ length: bs }, () => Array(bs).fill(''));

const be = document.querySelector('.board');
const ti = document.createElement('div');

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

        if (se.includes('.ooo..') || 
            se.includes('..ooo.') ||
            se.includes('.oo.o.') ||
            se.includes('.o.oo.')) {
            pt++;
        }
    }   

    return pt;
}

function ivm(row, col) {
    if (cp === 'black') {
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

function hcc(event) {
    const row = Number(event.target.dataset.row);
    const col = Number(event.target.dataset.col);
    if (board[row][col] === '' && ivm(row, col)) {
        board[row][col] = cp;
        const stone = document.createElement('div');
        stone.className = `stone ${cp}`;
        event.target.appendChild(stone);
        if (ckw(row, col)) {
            alert(`${cp} wins!`);
            rsb();
        } else {
            cp = cp === 'black' ? 'white' : 'black';
            uti();
        }
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

ing();