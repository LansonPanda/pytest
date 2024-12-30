let g = [];
let s = 0;

function ig() {
    g = Array(4).fill().map(() => Array(4).fill(0));
    s = 0;
    ant();
    ant();
    ug();
}

function ant() {
    let ac = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (g[i][j] === 0) {
                ac.push({i, j});
            }
        }
    }
    if (ac.length > 0) {
        let {i, j} = ac[Math.floor(Math.random() * ac.length)];
        g[i][j] = Math.random() < 0.9 ? 2 : 4;
        const ci = i * 4 + j;
        const cell = document.querySelectorAll('.cell')[ci];
        cell.classList.add('new-tile');
        setTimeout(() => cell.classList.remove('new-tile'), 300);
    }
}

function ug() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const ci = i * 4 + j;
            cells[ci].textContent = g[i][j] || '';
            cells[ci].style.backgroundColor = gc(g[i][j]);
        }
    }
    document.getElementById('score').textContent = s;
}

function gc(value) {
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

function move(dc) {
    let md = false;
    const ng = JSON.parse(JSON.stringify(g));
    let mc = [];

    if (dc === 'left') {
        for (let i = 0; i < 4; i++) {
            let { nr, mds } = pl(ng[i]);
            ng[i] = nr;
            mc = mc.concat(mds.map(j => ({i, j})));
        }
    } else if (dc === 'right') {
        for (let i = 0; i < 4; i++) {
            let { nr, mds } = pl(ng[i].reverse());
            ng[i] = nr.reverse();
            mc = mc.concat(mds.map(j => ({i, j: 3-j})));
        }
    } else if (dc === 'up') {
        for (let j = 0; j < 4; j++) {
            let column = [ng[0][j], ng[1][j], ng[2][j], ng[3][j]];
            let { nr, mds } = pl(column);
            for (let i = 0; i < 4; i++) {
                ng[i][j] = nr[i];
            }
            mc = mc.concat(mds.map(i => ({i, j})));
        }
    } else if (dc === 'down') {
        for (let j = 0; j < 4; j++) {
            let column = [ng[0][j], ng[1][j], ng[2][j], ng[3][j]];
            let { nr, mds } = pl(column.reverse());
            nr = nr.reverse();
            for (let i = 0; i < 4; i++) {
                ng[i][j] = nr[i];
            }
            mc = mc.concat(mds.map(i => ({i: 3-i, j})));
        }
    }

    if (JSON.stringify(g) !== JSON.stringify(ng)) {
        md = true;
        g = ng;
        ant();
        ug();
        
        mc.forEach(({i, j}) => {
            const ci = i * 4 + j;
            const cell = document.querySelectorAll('.cell')[ci];
            cell.classList.add('merged');
            setTimeout(() => cell.classList.remove('merged'), 200);
        });
    }

    if (igo()) {
        alert('게임 오버!');
    }
}

function pl(row) {
    let nr = row.filter(cell => cell !== 0);
    let mds = [];
    for (let i = 0; i < nr.length - 1; i++) {
        if (nr[i] === nr[i + 1]) {
            nr[i] *= 2;
            s += nr[i];
            nr.splice(i + 1, 1);
            mds.push(i);
        }
    }
    while (nr.length < 4) {
        nr.push(0);
    }
    return { nr, mds };
}

function igo() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (g[i][j] === 0) {
                return false;
            }
            if (i < 3 && g[i][j] === g[i + 1][j]) {
                return false;
            }
            if (j < 3 && g[i][j] === g[i][j + 1]) {
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

ig();