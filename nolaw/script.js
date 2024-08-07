let db;

const request = indexedDB.open('nolawScoreBoardDB', 1);

request.onsuccess = (event) => {
    db = event.target.result;
    var nolaw = new Nolaw(db);
    nolaw.startGame();
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const obS = db.createObjectStore('nolawScoreBoardDB', { keyPath: 'id', autoIncrement: true });
    obS.createIndex('name', 'name', { unique: false });
    obS.createIndex('score', 'score', { unique: false });
};


class Nolaw {
    constructor() {
        this.stageWidth = 7;
        this.stageHeight = 12;
        this.stageCanvas = document.getElementById("stage");

        this.cellSize = 40;
        this.stageLeftPadding = (this.stageCanvas.width - this.cellSize * this.stageWidth) / 2;
        this.stageTopPadding = (this.stageCanvas.height - this.cellSize * this.stageHeight) / 2;

        this.currentStair = 0;
        this.stairLength = 1000;
        this.timerId = null;
        this.checkProgressId = null;
        this.checkStair = null;
        this.cellColorArr = null;
        this.chracterColor = null;

        this.surveyForm = document.querySelector("#wrapper-container");
        this.progressBar = this.surveyForm.querySelector(".progress");
        this.gameStarted = false;

        this.easterEggString = 'kidong';
        this.userInput = '';
        this.op = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        window.onkeydown = (e) => {
            if (e.keyCode === 37 || e.keyCode === 90 || e.keyCode === 88) {
                this.move(0);
            } else if (e.keyCode === 39 || e.keyCode === 190 || e.keyCode === 191) {
                this.move(1);
            } else if (e.keyCode === 32) {
                this.spacebarHandler();
            } else if (e.keyCode === 33) {
                this.nextStair();
            }
        }

    }

    
    startGame() {
        if (this.gameStarted) {
            let virtualStage = new Array(this.stageHeight);
            for (let i = 0; i < this.stageHeight; i++) {
                virtualStage[i] = new Array(this.stageWidth).fill(null);
            }
            this.virtualStage = virtualStage;
            this.randomArray = this.generateRandomArray(this.stairLength);
            this.randomArray = this.makeArray(this.randomArray);

            this.currentStair = 0;
            this.progressBar.value = 0;
            clearInterval(this.checkProgressId);
            clearTimeout(this.timerId);
            
            this.chracterColor = this.generateRandomColor();

            let lE = document.getElementById("lines");
            lE.innerText = " " + this.currentStair;
            this.idfidb();  
            this.mainLoop();
        }
    }

    mainLoop() {
        this.checkStair = this.currentStair;
        this.drawStage();
        this.checkProgressBar();

        this.timerId = setTimeout(() => {
            this.mainLoop();
        }, this.getSpeed());
    }

    checkProgressBar() {
        let progress = 0;
        this.checkProgressId = setInterval(() => {
            progress += 1;
            this.progressBar.value = progress;
            if (progress === 100) {
                this.gameOver();
            }
        }, this.getSpeed() / 100);
    }


    checkProgress() {
        if (this.checkStair !== this.currentStair) {
            clearTimeout(this.timerId);
            clearTimeout(this.checkProgressId);
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        clearTimeout(this.timerId);
        clearTimeout(this.checkProgressId);

        this.gameStarted = false;
        this.randomArray = [];
        this.clearVirtualStage();
        this.clear(this.stageCanvas);
        this.ss();
    }

    drawStage() {
        this.clear(this.stageCanvas);
        this.setVirtualStage();
        this.setCellColor();
        let context = this.stageCanvas.getContext("2d");

        for (let y = 0; y < this.stageHeight; y++) {
            for (let x = 0; x < this.stageWidth; x++) {
                if (this.virtualStage[y][x] != null) {
                    this.drawCell(context,
                        this.stageLeftPadding + (x * this.cellSize),
                        this.stageTopPadding + (y * this.cellSize),
                        this.cellSize,
                        this.cellColorArr[11 - y]
                    );
                }
            }
        }

        this.drawCell2(context,
            this.stageLeftPadding + (3 * this.cellSize),
            this.stageTopPadding + (10 * this.cellSize)
        );
    }

    drawCell(context, cellX, cellY, cellSize, color) {
        let adjustedX = cellX + 0.5;
        let adjustedY = cellY + 0.5;
        let adjustedSize = cellSize - 1;
        context.fillStyle = color;
        context.fillRect(adjustedX, adjustedY, adjustedSize, adjustedSize - 20);

        context.strokeStyle = "rgb(255, 255, 255)";
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize - 20);
        context.lineTo(adjustedX, adjustedY);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();

        context.strokeStyle = "rgb(255, 255, 255)";
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize - 20);
        context.lineTo(adjustedX + adjustedSize, adjustedY + adjustedSize - 20);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();
    }

    // 캐릭터 색
    drawCell2(context, cellX, cellY) {
        let adjustedX = cellX + 7;
        let adjustedY = cellY + 5;
        context.fillStyle = this.chracterColor;//"rgb(102, 255, 051)";
        context.fillRect(adjustedX, adjustedY, 27, 35);

        let leftEyeX = cellX + 12;
        let leftEyeY = cellY + 13;
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(leftEyeX, leftEyeY, 6, 6);

        let rightEyeX = cellX + 24;
        let rightEyeY = cellY + 13;
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(rightEyeX, rightEyeY, 6, 6);

        let footX = cellX + 12;
        let footY = cellY + 35;
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(footX, footY, 17, 5);
    }

    setVirtualStage() {
        let currentIndex = this.findIndex(this.randomArray[this.currentStair]);
        let tum = currentIndex - 3;
        for (let y = 0; y < this.stageHeight; y++) {
            let setX = this.findIndex(this.randomArray[this.currentStair + y]) - tum;
            if (setX >= 0 && setX <= 6) {
                let setY = this.stageHeight - y - 1;
                this.virtualStage[setY][setX] = 1;
            }
        }
    }

    clearVirtualStage() {
        for (let y = 0; y < this.stageHeight; y++) {
            for (let x = 0; x < this.stageWidth; x++) {
                this.virtualStage[y][x] = null;
            }
        }
    }

    refreshStage() {
        this.clearVirtualStage();
        this.clear(this.stageCanvas);
        this.drawStage();
    }

    clear(canvas) {
        let context = canvas.getContext("2d");
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    checkBlockMove(cS, array, direction) {
        let currentIndex = this.findIndex(array[cS]);
        let nextIndex = this.findIndex(array[cS + 1]);

        if (direction === 0) {
            if (currentIndex > nextIndex) {
                return true;
            } else {
                return false;
            }
        } else {
            if (currentIndex < nextIndex) {
                return true;
            } else {
                return false;
            }
        }

    }

    findIndex(array) {
        return array.map((v, i) => v === 1 ? i : -1).filter(v => v !== -1);
    }

    getSpeed() {
        return 2000 - this.currentStair * 20;
    }

    move(direction) {
        if ((direction === 0 && this.checkBlockMove(this.currentStair, this.randomArray, 0)) ||
            (direction === 1 && this.checkBlockMove(this.currentStair, this.randomArray, 1))) {
            this.currentStair++;
            let lE = document.getElementById("lines");
            lE.innerText = " " + this.currentStair;
            this.refreshStage();
            this.checkProgress();
            this.checkProgressBar();
        } else {
            this.gameOver();
        }
    }

    // 다음 계단 이동
    nextStair() {
        if (this.op) {
            this.currentStair++;
            let lE = document.getElementById("lines");
            lE.innerText = " " + this.currentStair;
            this.refreshStage();
            this.checkProgress();
            this.checkProgressBar();
        }
    }

    getop() {
        this.op = true;
    }

    handleKeyDown(event) {
        const key = String.fromCharCode(event.keyCode).toLowerCase();
        this.userInput += key;
        console.log(this.userInput)

        if (this.userInput.includes(this.easterEggString)) {
            this.easterEggFunction();
            this.userInput = '';
        }
    }

    easterEggFunction() {
        alert("에스켈레이터 ON");
        this.userInput = '';
        this.getop();
    }

    generateRandomColor() {
        const red = Math.round(Math.random() * 255);
        const green = Math.round(Math.random() * 255);
        const blue = Math.round(Math.random() * 255);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    setCellColor() {
        if (this.cellColorArr === null) {
            this.cellColorArr = []; // cellColorArr 초기화
            for (let i = 0; i < this.stageHeight; i++) {
                this.cellColorArr.push(this.generateRandomColor());
            }
        } else {
            this.cellColorArr.push(this.generateRandomColor());
            this.cellColorArr.shift();
        }
    }


    generateRandomArray(length) {
        const array = [];
        for (let i = 0; i < length; i++) {
            const randomValue = Math.round(Math.random());
            array.push(randomValue);
        }
        return array;
    }

    makeArray(array) {
        var arr = this.create2DArray(this.stairLength, 0);
        let position = 20;

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < position; j++) {
                arr[i][j] = 0;
            }
            if (array[i] === 1) {
                arr[i][position] = 1;
                position++;
            } else {
                arr[i][position] = 1;
                position--;
            }
        }
        return arr;
    };

    create2DArray(rows, columns) {
        var arr = new Array(rows);
        for (var i = 0; i < rows; i++) {
            arr[i] = new Array(columns);
        }
        return arr;
    }

    spacebarHandler() {
        this.gameStarted = true;
        this.startGame();
    }

    ss() {
        let name = prompt("이름을 입력하세요.");
        if (name == null) {
            return;
        }

        let transaction = db.transaction(['nolawScoreBoardDB'], 'readwrite');
        let obS = transaction.objectStore('nolawScoreBoardDB');
        obS.add({ name: name, score: this.currentStair });
        this.idfidb();
    }

    idfidb() {
        let transaction = db.transaction(['nolawScoreBoardDB'], 'readonly');
        let obS = transaction.objectStore('nolawScoreBoardDB');
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
}
