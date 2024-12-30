let db;

const request = indexedDB.open('scoreBoardDB', 1);

request.onsuccess = (event) => {
    db = event.target.result;
    var tetris = new Tetris(db);
    tetris.sg();
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const obS = db.createObjectStore('scoreBoardDB', { keyPath: 'id', autoIncrement: true });
    obS.createIndex('name', 'name', { unique: false });
    obS.createIndex('score', 'score', { unique: false });
};

class Tetris {
    constructor() {
        this.db = db;
        this.stw = 10;
        this.sth = 20;

        this.stc = document.getElementById("stage");
        this.nc = document.getElementById("next");
        ////////////////////////////////
        this.hd = document.getElementById("hold");

        let cw = this.stc.width / this.stw;
        let ch = this.stc.height / this.sth;

        this.cs = cw < ch ? cw : ch;
        this.stlp = (this.stc.width - this.cs * this.stw) / 2;
        this.sttp = (this.stc.height - this.cs * this.sth) / 2;

        this.bl = this.createbl();
        this.dl = 0;
        this.cL = 0;
        this.gs = 600;
        this.score = 0;

        ////////////////////////////////
        this.holdUsed = 0;
        
        // fall 수정
        this.timerId = null;
        // fall 수정
        window.onkeydown = (e) => {
            if (e.keyCode === 37) {
                this.moveLeft();
            }
            if (e.keyCode === 38) {
                this.rotate();
            } else if (e.keyCode === 39) {
                this.moveRight();
            } else if (e.keyCode === 90 || e.keyCode === 32) {
                this.fall();
            } else if (e.keyCode === 40) {
                this.moveDown();
        ////////////////////////////////
            } else if (e.keyCode === 67 || e.keyCode === 16) { 
                this.hold();
            }
        }

        document.getElementById("t-m-l-b").onmousedown = (e) => {
            this.moveLeft();
        }
        document.getElementById("t-r-b").onmousedown = (e) => {
            this.rotate();
        }
        document.getElementById("t-m-r-b").onmousedown = (e) => {
            this.moveRight();
        }
        document.getElementById("t-f-b").onmousedown = (e) => {
            this.fall();
        }

    }

    createbl() {
        let bl = [
            { // 1
                shape: [[[-1, 0], [0, 0], [1, 0], [2, 0]],
                [[0, -1], [0, 0], [0, 1], [0, 2]],
                [[-1, 0], [0, 0], [1, 0], [2, 0]],
                [[0, -1], [0, 0], [0, 1], [0, 2]]],
                color: "rgb(0, 255, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 128)"
            },
            { // 2
                shape: [[[0, 0], [1, 0], [0, 1], [1, 1]],
                [[0, 0], [1, 0], [0, 1], [1, 1]],
                [[0, 0], [1, 0], [0, 1], [1, 1]],
                [[0, 0], [1, 0], [0, 1], [1, 1]]],
                color: "rgb(255, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 128, 0)"
            },
            { // 3
                shape: [[[0, 0], [1, 0], [-1, 1], [0, 1]],
                [[-1, -1], [-1, 0], [0, 0], [0, 1]],
                [[0, 0], [1, 0], [-1, 1], [0, 1]],
                [[-1, -1], [-1, 0], [0, 0], [0, 1]]],
                color: "rgb(0, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 0)"
            },
            { // 4
                shape: [[[-1, 0], [0, 0], [0, 1], [1, 1]],
                [[0, -1], [-1, 0], [0, 0], [-1, 1]],
                [[-1, 0], [0, 0], [0, 1], [1, 1]],
                [[0, -1], [-1, 0], [0, 0], [-1, 1]]],
                color: "rgb(255, 0, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 0, 0)"
            },
            { // 5
                shape: [[[-1, -1], [-1, 0], [0, 0], [1, 0]],
                [[0, -1], [1, -1], [0, 0], [0, 1]],
                [[-1, 0], [0, 0], [1, 0], [1, 1]],
                [[0, -1], [0, 0], [-1, 1], [0, 1]]],
                color: "rgb(0, 0, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 0, 128)"
            },
            { // 6
                shape: [[[1, -1], [-1, 0], [0, 0], [1, 0]],
                [[0, -1], [0, 0], [0, 1], [1, 1]],
                [[-1, 0], [0, 0], [1, 0], [-1, 1]],
                [[-1, -1], [0, -1], [0, 0], [0, 1]]],
                color: "rgb(255, 165, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 82, 0)"
            },
            { // 7
                shape: [[[0, -1], [-1, 0], [0, 0], [1, 0]],
                [[0, -1], [0, 0], [1, 0], [0, 1]],
                [[-1, 0], [0, 0], [1, 0], [0, 1]],
                [[0, -1], [-1, 0], [0, 0], [0, 1]]],
                color: "rgb(255, 0, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 0, 128)"
            }
        ];
        return bl;
    }

    drawBlock(x, y, type, angle, canvas) {
        let c = canvas.getContext("2d");
        let b = this.bl[type];
        for (let i = 0; i < b.shape[angle].length; i++) {
            this.drawCell(c,
                x + (b.shape[angle][i][0] * this.cs),
                y + (b.shape[angle][i][1] * this.cs),
                this.cs,
                type);
        }
    }

    // 보조선 추가
    drawBackground() {
        let c = this.stc.getContext("2d");
        c.strokeStyle = "rgb(80, 80, 80)";
        c.lineWidth = 2;

        for (let x = 0; x <= this.stw; x++) {
            c.beginPath();
            c.moveTo(this.stlp + x * this.cs, this.sttp);
            c.lineTo(this.stlp + x * this.cs, this.sttp + this.sth * this.cs);
            c.stroke();
        }
        for (let y = 0; y <= this.sth; y++) {
            c.beginPath();
            c.moveTo(this.stlp, this.sttp + y * this.cs);
            c.lineTo(this.stlp + this.stw * this.cs, this.sttp + y * this.cs);
            c.stroke();
        }
    }
    // 보조선 추가

    drawCell(c, cellX, cellY, cs, type, ck) {
        let b = this.bl[type];
        let adX = cellX + 0.5;
        let adY = cellY + 0.5;
        let adS = cs - 1;

        c.fillStyle = b.color;
        if (ck !== undefined) {
            let r = b.color.split(",")[0].split("(")[1];
            let g = b.color.split(",")[1];
            let b = b.color.split(",")[2].split(")")[0];
            c.fillStyle = "rgb(" + (r + 100) + "," + (g - 100) + "," + (b - 100) + ")";
        }
        c.fillRect(adX, adY, adS, adS);
        c.strokeStyle = b.highlight;
        c.beginPath();

        c.moveTo(adX, adY + adS);
        c.lineTo(adX, adY);
        c.lineTo(adX + adS, adY);
        c.stroke();

        c.strokeStyle = b.shadow;
        c.beginPath();

        c.moveTo(adX, adY + adS);
        c.lineTo(adX + adS, adY + adS);
        c.lineTo(adX + adS, adY);
        c.stroke();
    }

    sg() {
        let virtualStage = new Array(this.stw);

        for (let i = 0; i < this.stw; i++) {
            virtualStage[i] = new Array(this.sth).fill(null);
        }
        this.virtualStage = virtualStage;
        this.cB = null;

        this.nextBlock = this.grb();
        this.idfidb();
        this.ml();
    }

    ml() {
        if (this.cB == null) {
            if (!this.cnb()) {
                return;
            }
        } else {
            this.fb();
        }
        this.drawStage();

        if (this.cB != null) {
            this.drawBlock(this.stlp + this.bX * this.cs,
                this.sttp + this.bY * this.cs,
                this.cB, this.bA, this.stc);
        }

        this.gs = this.increaseSpeed(this.dl);
        // fall 수정
        this.timerId = setTimeout(() => {
            this.ml(this);
        }, this.gs);
        // fall 수정
    }

    increaseSpeed(dl) {
        let levelsElem = document.getElementById("level");
        if (dl >= 140) {
            levelsElem.innerText = " " + 7;
            return 75;
        } else if (dl >= 95) {
            levelsElem.innerText = " " + 6;
            return 100;
        } else if (dl >= 60) {
            levelsElem.innerText = " " + 5;
            return 150;
        } else if (dl >= 45) {
            levelsElem.innerText = " " + 4;
            return 200;
        } else if (dl >= 25) {
            levelsElem.innerText = " " + 3;
            return 300;
        } else if (dl >= 10) {
            levelsElem.innerText = " " + 2;
            return 400;
        } else if (dl >= 0) {
            levelsElem.innerText = " " + 1;
            return 500;
        }

    }

    // ++
    nextLevel(dl) {
        if (dl >= 140) {
            return 'final';
        } else if (dl >= 95) {
            return 140 - dl;
        } else if (dl >= 60) {
            return 95 - dl;
        } else if (dl >= 45) {
            return 60 - dl;
        } else if (dl >= 25) {
            return 45 - dl;
        } else if (dl >= 10) {
            return 25 - dl;
        } else if (dl >= 0) {
            return 10 - dl;
        }

    }
    // --

    cnb() {
        this.cB = this.nextBlock;
        this.nextBlock = this.grb();
        this.bX = Math.floor(this.stw / 2 - 2);
        this.bY = 0;
        this.bA = 0;
        this.dnb();
        ////////////////////////////////
        this.dhb();
        if (this.holdUsed === 1) {
            this.holdUsed = 0;
        }

        if (!this.cbm(this.bX, this.bY, this.cB, this.bA)) {
            let messageElem = document.getElementById("message");
            messageElem.innerText = "GAME OVER";
            this.ss();
            return false;
        }
        return true;
    }

    ss() {
        let name = prompt("이름을 입력하세요.");
        if (name == null) {
            return;
        }

        let transaction = db.transaction(['scoreBoardDB'], 'readwrite');
        let obS = transaction.objectStore('scoreBoardDB');
        obS.add({ name: name, score: this.score });
        this.idfidb();

    }

    // 점수 계산 함수
    calScore() {
        if (this.cL == 1) {
            this.score += 100;
        } else if (this.cL == 2) {
            this.score += 300;
        } else if (this.cL == 3) {
            this.score += 600;
        } else if (this.cL == 4) {
            this.score += 1000;
        }
    }

    calScore2(fallcount) {
        // 소숫점 이하는 버림
        this.score += Math.floor(fallcount * 0.3);
    }

    idfidb() {
        let transaction = db.transaction(['scoreBoardDB'], 'readonly');
        let obS = transaction.objectStore('scoreBoardDB');
        let index = obS.index('score');

        let request = index.openCursor(null, 'prev');
        let scoreBoardElem = document.getElementById("scoreboard-table");
        scoreBoardElem.innerHTML = "";

        let count = 0;
        request.onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor && count < 10) {
                let scoreBoard = document.createElement("div");
                if (count === 0) {
                    scoreBoard.innerText = count + 1 + ". " + cursor.value.name + " : " + cursor.value.score;
                    scoreBoard.style.color = "yellow";
                    scoreBoardElem.appendChild(scoreBoard);
                    cursor.continue();
                    count++;
                    return;
                }

                scoreBoard.innerText = count + 1 + ". " + cursor.value.name + " : " + cursor.value.score;
                scoreBoardElem.appendChild(scoreBoard);
                cursor.continue();
                count++;
            }
        };
    }

    dnb() {
        this.clear(this.nc);
        this.drawBlock(this.cs * 2, this.cs, this.nextBlock,
            0, this.nc);
    }

    ////////////////////////////////
    dhb() {
        this.clear(this.hd);
        if (this.holdBlock != null) {
            this.drawBlock(this.cs * 2, this.cs, this.holdBlock,
                0, this.hd);
        }
    }

    grb() {
        return Math.floor(Math.random() * 7);
    }

    fb() {
        if (this.cbm(this.bX, this.bY + 1, this.cB, this.bA)) {
            this.bY++;
        } else {
            this.fixBlock(this.bX, this.bY, this.cB, this.bA);
            this.cB = null;
        }
    }

    cbm(x, y, type, angle) {
        for (let i = 0; i < this.bl[type].shape[angle].length; i++) {
            let cellX = x + this.bl[type].shape[angle][i][0];
            let cellY = y + this.bl[type].shape[angle][i][1];

            if (cellX < 0 || cellX > this.stw - 1) {
                return false;
            }
            if (cellY > this.sth - 1) {
                return false;
            }
            if (this.virtualStage[cellX][cellY] != null) {
                return false;
            }
        }
        return true;
    }

    fixBlock(x, y, type, angle) {
        for (let i = 0; i < this.bl[type].shape[angle].length; i++) {
            let cellX = x + this.bl[type].shape[angle][i][0];
            let cellY = y + this.bl[type].shape[angle][i][1];

            if (cellY >= 0) {
                this.virtualStage[cellX][cellY] = type;
            }
        }

        for (let y = this.sth - 1; y >= 0;) {
            let filled = true;
            for (let x = 0; x < this.stw; x++) {
                if (this.virtualStage[x][y] == null) {
                    filled = false;
                    break;
                }
            }

            if (filled) {
                for (let y2 = y; y2 > 0; y2--) {
                    for (let x = 0; x < this.stw; x++) {
                        this.virtualStage[x][y2] = this.virtualStage[x][y2 - 1];
                    }
                }
                for (let x = 0; x < this.stw; x++) {
                    this.virtualStage[x][0] = null;
                }
                this.cL++;
                this.dl++;

            } else {
                y--;
            }
        }

        this.calScore();
        let lE = document.getElementById("lines");
        lE.innerText = " " + this.score;

        // ++
        let RL = document.getElementById("remain-times");
        RL.innerText = this.nextLevel(this.dl);
        // --
        this.cL = 0;
    }

    drawStage() {
        this.clear(this.stc);
        let c = this.stc.getContext("2d");
        // 보조선 추가
        this.drawBackground();
        // 보조선 추가

        for (let x = 0; x < this.virtualStage.length; x++) {
            for (let y = 0; y < this.virtualStage[x].length; y++) {
                if (this.virtualStage[x][y] != null) {
                    this.drawCell(c,
                        this.stlp + (x * this.cs),
                        this.sttp + (y * this.cs),
                        this.cs,
                        this.virtualStage[x][y]);
                }
            }
        }
    }

    moveLeft() {
        if (this.cbm(this.bX - 1, this.bY, this.cB, this.bA)) {
            this.bX--;
            this.refreshStage();
        }
    }

    moveRight() {
        if (this.cbm(this.bX + 1, this.bY, this.cB, this.bA)) {
            this.bX++;
            this.refreshStage();
        }
    }

    // ++
    moveDown() {
        if (this.cbm(this.bX, this.bY + 1, this.cB, this.bA)) {
            this.bY++;
            this.refreshStage();
        }
    }
    // --

    rotate() {
        let nA;
        if (this.bA < 3) {
            nA = this.bA + 1;
        } else {
            nA = 0;
        }
        if (this.cbm(this.bX, this.bY, this.cB, nA)) {
            this.bA = nA;
            this.refreshStage();
        }
    }

    fall() {
        this.fallcount = 0;
        while (this.cbm(this.bX, this.bY + 1, this.cB, this.bA)) {
            this.fallcount++;
            this.bY++;
            this.refreshStage();
        }
        this.calScore2(this.fallcount);
        clearTimeout(this.timerId);
        this.ml();
    }

    refreshStage() {
        this.clear(this.stc);
        this.drawStage();
        this.drawBlock(this.stlp + this.bX * this.cs,
            this.sttp + this.bY * this.cs,
            this.cB, this.bA, this.stc);
    }

    clear(canvas) {
        let c = canvas.getContext("2d");
        c.fillStyle = "rgb(0, 0, 0)";
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    ////////////////////////////////
    hold() {
        if (this.holdUsed < 1) {
            if (this.holdBlock == null) {
                this.holdBlock = this.cB;
                this.cB = this.nextBlock;
                this.bX = Math.floor(this.stw / 2 - 2);
                this.bY = 0;
                this.bA = 0;
                this.nextBlock = this.grb();
                this.dnb();
                this.dhb();
            } else {
                let temp = this.cB;
                this.cB = this.holdBlock;
                this.holdBlock = temp;
                this.bX = Math.floor(this.stw / 2 - 2);
                this.bY = 0;
                this.bA = 0;
                this.dnb();
                this.dhb();
            }
            this.refreshStage();
            this.holdUsed += 1;
        } else {
            return;
        }
    } 
}