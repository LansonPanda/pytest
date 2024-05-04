let db;

const request = indexedDB.open('scoreBoardDB', 1);

request.onsuccess = (event) => {
    db = event.target.result;
    var tetris = new Tetris(db);
    tetris.sG();
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

        this.stW = 10;
        this.stH = 20;
        this.stC = document.getElementById("stage");
        this.nC = document.getElementById("next");
        let cW = this.stC.width / this.stW;
        let cH = this.stC.height / this.stH;
        this.cS = cW < cH ? cW : cH;
        this.stLP = (this.stC.width - this.cS * this.stW) / 2;
        this.stTP = (this.stC.height - this.cS * this.stH) / 2;
        this.bl = this.createbl();
        this.dL = 0;
        this.gs = 600;

        window.onkeydown = (e) => {
            if (e.keyCode === 37) {
                this.moveLeft();
            } else if (e.keyCode === 38) {
                this.rotate();
            } else if (e.keyCode === 39) {
                this.moveRight();
            } else if (e.keyCode === 40) {
                this.fall();
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
            {
                shape: [[[-1, 0], [0, 0], [1, 0], [2, 0]],
                [[0, -1], [0, 0], [0, 1], [0, 2]],
                [[-1, 0], [0, 0], [1, 0], [2, 0]],
                [[0, -1], [0, 0], [0, 1], [0, 2]]],
                color: "rgb(0, 255, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 128)"
            },
            {
                shape: [[[0, 0], [1, 0], [0, 1], [1, 1]],
                [[0, 0], [1, 0], [0, 1], [1, 1]],
                [[0, 0], [1, 0], [0, 1], [1, 1]],
                [[0, 0], [1, 0], [0, 1], [1, 1]]],
                color: "rgb(255, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 128, 0)"
            },
            {
                shape: [[[0, 0], [1, 0], [-1, 1], [0, 1]],
                [[-1, -1], [-1, 0], [0, 0], [0, 1]],
                [[0, 0], [1, 0], [-1, 1], [0, 1]],
                [[-1, -1], [-1, 0], [0, 0], [0, 1]]],
                color: "rgb(0, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 0)"
            },
            {
                shape: [[[-1, 0], [0, 0], [0, 1], [1, 1]],
                [[0, -1], [-1, 0], [0, 0], [-1, 1]],
                [[-1, 0], [0, 0], [0, 1], [1, 1]],
                [[0, -1], [-1, 0], [0, 0], [-1, 1]]],
                color: "rgb(255, 0, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 0, 0)"
            },
            {
                shape: [[[-1, -1], [-1, 0], [0, 0], [1, 0]],
                [[0, -1], [1, -1], [0, 0], [0, 1]],
                [[-1, 0], [0, 0], [1, 0], [1, 1]],
                [[0, -1], [0, 0], [-1, 1], [0, 1]]],
                color: "rgb(0, 0, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 0, 128)"
            },
            {
                shape: [[[1, -1], [-1, 0], [0, 0], [1, 0]],
                [[0, -1], [0, 0], [0, 1], [1, 1]],
                [[-1, 0], [0, 0], [1, 0], [-1, 1]],
                [[-1, -1], [0, -1], [0, 0], [0, 1]]],
                color: "rgb(255, 165, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 82, 0)"
            },
            {
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
                x + (b.shape[angle][i][0] * this.cS),
                y + (b.shape[angle][i][1] * this.cS),
                this.cS,
                type);
        }
    }
    drawCell(c, cellX, cellY, cS, type) {
        let b = this.bl[type];
        let adX = cellX + 0.5;
        let adY = cellY + 0.5;
        let adS = cS - 1;
        c.fillStyle = b.color;
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

    sG() {
        let virtualStage = new Array(this.stW);
        for (let i = 0; i < this.stW; i++) {
            virtualStage[i] = new Array(this.stH).fill(null);
        }
        this.virtualStage = virtualStage;
        this.cB = null;
        this.nextBlock = this.gRB();
        this.lDFIDB();
        this.mL();
    }

    mL() {
        if (this.cB == null) {
            if (!this.cNB()) {
                return;
            }
        } else {
            this.fB();
        }
        this.drawStage();
        if (this.cB != null) {
            this.drawBlock(this.stLP + this.bX * this.cS,
                this.stTP + this.bY * this.cS,
                this.cB, this.bA, this.stC);
        }
        this.gs = this.increaseSpeed(this.dL);
        setTimeout(this.mL.bind(this), this.gs);
    }

    increaseSpeed(dL) {
        let levelsElem = document.getElementById("level");
        if (dL >= 50) {
            levelsElem.innerText = " " + 6;
            return 50;
        } else if (dL >= 40) {
            levelsElem.innerText = " " + 5;
            return 100;
        } else if (dL >= 30) {
            levelsElem.innerText = " " + 4;
            return 200;
        } else if (dL >= 20) {
            levelsElem.innerText = " " + 3;
            return 300;
        } else if (dL >= 10) {
            levelsElem.innerText = " " + 2;
            return 400;
        } else if (dL >= 0) {
            levelsElem.innerText = " " + 1;
            return 500;
        }

    }

    cNB() {
        this.cB = this.nextBlock;
        this.nextBlock = this.gRB();
        this.bX = Math.floor(this.stW / 2 - 2);
        this.bY = 0;
        this.bA = 0;
        this.dNB();
        if (!this.cBM(this.bX, this.bY, this.cB, this.bA)) {
            let messageElem = document.getElementById("message");
            messageElem.innerText = "GAME OVER";
            this.sS();
            return false;
        }
        return true;
    }

    sS() {
        let name = prompt("이름을 입력하세요.");
        if (name == null) {
            return;
        }
        let score = this.dL;
        let transaction = db.transaction(['scoreBoardDB'], 'readwrite');
        let obS = transaction.objectStore('scoreBoardDB');
        obS.add({ name: name, score: score });     
        this.lDFIDB();

    }

    lDFIDB() {
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
                scoreBoard.innerText = count+1 + " " + cursor.value.name + " : " + cursor.value.score;
                scoreBoardElem.appendChild(scoreBoard);
                cursor.continue();
                count++;
            }
        };
    }

    dNB() {
        this.clear(this.nC);
        this.drawBlock(this.cS * 2, this.cS, this.nextBlock,
            0, this.nC);
    }

    gRB() {
        return Math.floor(Math.random() * 7);
    }

    fB() {
        if (this.cBM(this.bX, this.bY + 1, this.cB, this.bA)) {
            this.bY++;
        } else {
            this.fixBlock(this.bX, this.bY, this.cB, this.bA);
            this.cB = null;
        }
    }

    cBM(x, y, type, angle) {
        for (let i = 0; i < this.bl[type].shape[angle].length; i++) {
            let cellX = x + this.bl[type].shape[angle][i][0];
            let cellY = y + this.bl[type].shape[angle][i][1];
            if (cellX < 0 || cellX > this.stW - 1) {
                return false;
            }
            if (cellY > this.stH - 1) {
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
        for (let y = this.stH - 1; y >= 0;) {
            let filled = true;
            for (let x = 0; x < this.stW; x++) {
                if (this.virtualStage[x][y] == null) {
                    filled = false;
                    break;
                }
            }
            if (filled) {
                for (let y2 = y; y2 > 0; y2--) {
                    for (let x = 0; x < this.stW; x++) {
                        this.virtualStage[x][y2] = this.virtualStage[x][y2 - 1];
                    }
                }
                for (let x = 0; x < this.stW; x++) {
                    this.virtualStage[x][0] = null;
                }
                let lE = document.getElementById("lines");
                this.dL++;
                lE.innerText = " " + this.dL;
            } else {
                y--;
            }
        }
    }

    drawStage() {
        this.clear(this.stC);

        let c = this.stC.getContext("2d");
        for (let x = 0; x < this.virtualStage.length; x++) {
            for (let y = 0; y < this.virtualStage[x].length; y++) {
                if (this.virtualStage[x][y] != null) {
                    this.drawCell(c,
                        this.stLP + (x * this.cS),
                        this.stTP + (y * this.cS),
                        this.cS,
                        this.virtualStage[x][y]);
                }
            }
        }
    }

    moveLeft() {
        if (this.cBM(this.bX - 1, this.bY, this.cB, this.bA)) {
            this.bX--;
            this.refreshStage();
        }
    }

    moveRight() {
        if (this.cBM(this.bX + 1, this.bY, this.cB, this.bA)) {
            this.bX++;
            this.refreshStage();
        }
    }

    rotate() {
        let nA;
        if (this.bA < 3) {
            nA = this.bA + 1;
        } else {
            nA = 0;
        }
        if (this.cBM(this.bX, this.bY, this.cB, nA)) {
            this.bA = nA;
            this.refreshStage();
        }
    }

    fall() {
        while (this.cBM(this.bX, this.bY + 1, this.cB, this.bA)) {
            this.bY++;
            this.refreshStage();
        }
    }

    refreshStage() {
        this.clear(this.stC);
        this.drawStage();
        this.drawBlock(this.stLP + this.bX * this.cS,
            this.stTP + this.bY * this.cS,
            this.cB, this.bA, this.stC);
    }

    clear(canvas) {
        let c = canvas.getContext("2d");
        c.fillStyle = "rgb(0, 0, 0)";
        c.fillRect(0, 0, canvas.width, canvas.height);
    }
}