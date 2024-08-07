let db;

const request = indexedDB.open('nolawScoreBoardDB', 1);

request.onsuccess = (event) => {
    db = event.target.result;
    var nolaw = new Nolaw(db);
    nolaw.sg();
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const obS = db.createObjectStore('nolawScoreBoardDB', { keyPath: 'id', autoIncrement: true });
    obS.createIndex('name', 'name', { unique: false });
    obS.createIndex('score', 'score', { unique: false });
};


class Nolaw {
    constructor() {
        this.sw = 7;
        this.sh = 12;
        this.sc = document.getElementById("stage");

        this.cse = 40;
        this.slp = (this.sc.width - this.cse * this.sw) / 2;
        this.stp = (this.sc.height - this.cse * this.sh) / 2;

        this.csr = 0;
        this.sl = 1000;
        this.timerId = null;
        this.cpId = null;
        this.cst = null;
        this.cca = null;
        this.cc = null;

        this.sf = document.querySelector("#w-p");
        this.pb = this.sf.querySelector(".progress");
        this.gs = false;

        this.ees = 'kidong';
        this.ek = '';
        this.op = false;

        document.addEventListener('keydown', this.hkd.bind(this));
        
        window.onkeydown = (e) => {
            if (e.keyCode === 37 || e.keyCode === 90 || e.keyCode === 88) {
                this.move(0);
            } else if (e.keyCode === 39 || e.keyCode === 190 || e.keyCode === 191) {
                this.move(1);
            } else if (e.keyCode === 32 || e.keyCode === 38) {
                this.s1();
            } else if (e.keyCode === 33) {
                this.nextStair();
            }
        }

    }

    sg() {
        if (this.gs) {
            let vs = new Array(this.sh);
            for (let i = 0; i < this.sh; i++) {
                vs[i] = new Array(this.sw).fill(null);
            }
            this.vs = vs;
            this.ra = this.gra(this.sl);
            this.ra = this.ma(this.ra);

            this.csr = 0;
            this.pb.value = 0;
            clearInterval(this.cpId);
            clearTimeout(this.timerId);

            this.cc = this.grc();

            let lE = document.getElementById("lines");
            lE.innerText = " " + this.csr;
            this.idf();
            this.mainLoop();
        }
    }

    mainLoop() {
        this.cst = this.csr;
        this.ds();
        this.cpb();

        this.timerId = setTimeout(() => {
            this.mainLoop();
        }, this.gsd());
    }

    cpb() {
        let p = 0;
        this.cpId = setInterval(() => {
            p += 1;
            this.pb.value = p;
            if (p === 100) {
                this.gameOver();
            }
        }, this.gsd() / 100);
    }


    cp() {
        if (this.cst !== this.csr) {
            clearTimeout(this.timerId);
            clearTimeout(this.cpId);
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        clearTimeout(this.timerId);
        clearTimeout(this.cpId);

        this.gs = false;
        this.ra = [];
        this.cvs();
        this.clear(this.sc);
        this.ss();
    }

    ds() {
        this.clear(this.sc);
        this.svs();
        this.scc();
        let c = this.sc.getContext("2d");

        for (let y = 0; y < this.sh; y++) {
            for (let x = 0; x < this.sw; x++) {
                if (this.vs[y][x] != null) {
                    this.dc(c,
                        this.slp + (x * this.cse),
                        this.stp + (y * this.cse),
                        this.cse,
                        this.cca[11 - y]
                    );
                }
            }
        }

        this.dc2(c,
            this.slp + (3 * this.cse),
            this.stp + (10 * this.cse)
        );
    }

    dc(c, cx, cy, cse, color) {
        let ax = cx + 0.5;
        let ay = cy + 0.5;
        let asd = cse - 1;
        c.fillStyle = color;
        c.fillRect(ax, ay, asd, asd - 20);

        c.strokeStyle = "rgb(255, 255, 255)";
        c.beginPath();
        c.moveTo(ax, ay + asd - 20);
        c.lineTo(ax, ay);
        c.lineTo(ax + asd, ay);
        c.stroke();

        c.strokeStyle = "rgb(255, 255, 255)";
        c.beginPath();
        c.moveTo(ax, ay + asd - 20);
        c.lineTo(ax + asd, ay + asd - 20);
        c.lineTo(ax + asd, ay);
        c.stroke();
    }

    // 캐릭터 색
    dc2(c, cx, cy) {
        let ax = cx + 7;
        let ay = cy + 5;
        c.fillStyle = this.cc;//"rgb(102, 255, 051)";
        c.fillRect(ax, ay, 27, 35);

        let lx = cx + 12;
        let ly = cy + 13;
        c.fillStyle = "rgb(0, 0, 0)";
        c.fillRect(lx, ly, 6, 6);

        let rx = cx + 24;
        let ry = cy + 13;
        c.fillStyle = "rgb(0, 0, 0)";
        c.fillRect(rx, ry, 6, 6);

        let fx = cx + 12;
        let fy = cy + 35;
        c.fillStyle = "rgb(0, 0, 0)";
        c.fillRect(fx, fy, 17, 5);
    }

    svs() {
        let ci = this.findIndex(this.ra[this.csr]);
        let tum = ci - 3;
        for (let y = 0; y < this.sh; y++) {
            let sx = this.findIndex(this.ra[this.csr + y]) - tum;
            if (sx >= 0 && sx <= 6) {
                let sy = this.sh - y - 1;
                this.vs[sy][sx] = 1;
            }
        }
    }

    cvs() {
        for (let y = 0; y < this.sh; y++) {
            for (let x = 0; x < this.sw; x++) {
                this.vs[y][x] = null;
            }
        }
    }

    rs() {
        this.cvs();
        this.clear(this.sc);
        this.ds();
    }

    clear(canvas) {
        let c = canvas.getContext("2d");
        c.fillStyle = "rgb(0, 0, 0)";
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    cbm(cS, array, dc) {
        let ci = this.findIndex(array[cS]);
        let ni = this.findIndex(array[cS + 1]);

        if (dc === 0) {
            if (ci > ni) {
                return true;
            } else {
                return false;
            }
        } else {
            if (ci < ni) {
                return true;
            } else {
                return false;
            }
        }

    }

    findIndex(array) {
        return array.map((v, i) => v === 1 ? i : -1).filter(v => v !== -1);
    }

    gsd() {
        return 2000 - this.csr * 20;
    }

    move(dc) {
        if ((dc === 0 && this.cbm(this.csr, this.ra, 0)) ||
            (dc === 1 && this.cbm(this.csr, this.ra, 1))) {
            this.csr++;
            let lE = document.getElementById("lines");
            lE.innerText = " " + this.csr;
            this.rs();
            this.cp();
            this.cpb();
        } else {
            this.gameOver();
        }
    }

    // 다음 계단 이동
    nextStair() {
        if (this.op) {
            this.csr++;
            let lE = document.getElementById("lines");
            lE.innerText = " " + this.csr;
            this.rs();
            this.cp();
            this.cpb();
        }
    }

    getop() {
        this.op = true;
    }

    hkd(event) {
        const key = String.fromCharCode(event.keyCode).toLowerCase();
        this.ek += key;

        if (this.ek.includes(this.ees)) {
            this.eef();
            this.ek = '';
        }
    }

    eef() {
        alert("에스켈레이터 ON");
        this.ek = '';
        this.getop();
    }

    grc() {
        const red = Math.round(Math.random() * 255);
        const green = Math.round(Math.random() * 255);
        const blue = Math.round(Math.random() * 255);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    scc() {
        if (this.cca === null) {
            this.cca = []; // cca 초기화
            for (let i = 0; i < this.sh; i++) {
                this.cca.push(this.grc());
            }
        } else {
            this.cca.push(this.grc());
            this.cca.shift();
        }
    }


    gra(length) {
        const array = [];
        for (let i = 0; i < length; i++) {
            const rv = Math.round(Math.random());
            array.push(rv);
        }
        return array;
    }

    ma(array) {
        var arr = this.c2(this.sl, 0);
        let p = 100;

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < p; j++) {
                arr[i][j] = 0;
            }
            if (array[i] === 1) {
                arr[i][p] = 1;
                p++;
            } else {
                arr[i][p] = 1;
                p--;
            }
        }
        return arr;
    };

    c2(r, c) {
        var arr = new Array(r);
        for (var i = 0; i < r; i++) {
            arr[i] = new Array(c);
        }
        return arr;
    }

    s1() {
        this.gs = true;
        this.sg();
    }

    ss() {
        let name = prompt("이름을 입력하세요.");
        if (name == null) {
            return;
        }

        let ts = db.transaction(['nolawScoreBoardDB'], 'readwrite');
        let obS = ts.objectStore('nolawScoreBoardDB');
        obS.add({ name: name, score: this.csr });
        this.idf();
    }

    idf() {
        let ts = db.transaction(['nolawScoreBoardDB'], 'readonly');
        let obS = ts.objectStore('nolawScoreBoardDB');
        let index = obS.index('score');

        let request = index.openCursor(null, 'prev');
        let sb = document.getElementById("scoreboard-table");
        sb.innerHTML = "";

        let count = 0;
        request.onsuccess = (event) => {
            let cs = event.target.result;
            if (cs && count < 10) {
                let s = document.createElement("div");
                if (count === 0) {
                    s.innerText = count + 1 + ". " + cs.value.name + " : " + cs.value.score;
                    s.style.color = "yellow";
                    sb.appendChild(s);
                    cs.continue();
                    count++;
                    return;
                }

                s.innerText = count + 1 + ". " + cs.value.name + " : " + cs.value.score;
                sb.appendChild(s);
                cs.continue();
                count++;
            }
        };
    }
}
