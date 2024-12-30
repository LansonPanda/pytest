let db;
const a = document.querySelector('span');

const request = indexedDB.open('jDB', 1);

request.onsuccess = (event) => {
    db = event.target.result;
    LDFDB();
    a.style.color = 'blue';
    a.textContent = '새로운 기동대대원을 추가하세요!';
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const oS = db.createObjectStore('jjS', { keyPath: 'id', autoIncrement: true });
    ['sM', 'd', 'd2', 'i'].forEach(index => oS.createIndex(index, index, { unique: false }));
};

const gASD = (data) => {
    const gps = {'1중대': [], '2중대': [], '3중대': [], '본부중대': [], '전역자': []};
    const today = new Date();
    const filterExpired = (t) => crD(new Date(t.d2)) <= 0;

    data.forEach((t) => {
        if (filterExpired(t)) {
            t.i = `${t.sM} 故${t.i}`;
            gps['전역자'].push(t);
        } else {
            gps[t.sM].push(t);
        }
    });

    Object.values(gps).forEach(g => g.sort((a, b) => new Date(a.d) - new Date(b.d)));

    return gps;
};

const rG = (gps) => {
    const jjJ = document.querySelector('#j-list');
    jjJ.innerHTML = '';

    Object.entries(gps).forEach(([gK, g]) => {
        const gE = document.createElement('div');
        gE.classList.add('g', `g-${gK.toLowerCase()}`);
        gE.textContent = gK;

        const giE = document.createElement('div');
        giE.classList.add('g-ts');

        g.forEach((t) => {
            const iE = document.createElement('div');
            iE.classList.add('j-t');
            iE.setAttribute('data-id', t.id);

            const rD = crD(new Date(t.d2));
            const rT = `${rD}일`;

            iE.innerHTML = `
                <span class="j-t-na">${t.i}</span>
                <span class="j-t-date1"> | ${t.d}</span>
                <span class="j-t-date2"> ~ ${t.d2}</span>
                <span class="j-t-rT"> | ${rT}</span>
                <button class="delete-dBt">삭제</button>
            `;

            iE.querySelector('.delete-dBt').addEventListener('click', () => {
                rjj(t.id);
                LDFDB();
            });
            
            giE.appendChild(iE);
        });

        jjJ.appendChild(gE);
        jjJ.appendChild(giE);
    });
};

const LDFDB = () => {
    const ts = db.transaction(['jjS'], 'readonly');
    const oS = ts.objectStore('jjS');
    const gR = oS.getAll();

    gR.onsuccess = (event) => {
        const data = event.target.result;
        const gps = gASD(data);
        rG(gps);
    };
};

const ajj = (sM, d, d2, i) => {
    const iNE = (value) => value.trim() !== '';

    if (i === '이순신') {
        window.location.href = '/list.html';
        return;
    }

    if (i === 'tetris') {
        window.location.href = '/tetrisProject/tetris.html';
        return;
    }

    if (i === 'nolaw') {
        window.location.href = '/nolaw/index.html';
        return;
    } 
    
    if (i === 'backup') {
        backupData();
        return;
    }

    if (i === 'restore') {
        document.getElementById("fileInput").click();
        return;
    }

    if (![sM, d, d2, i].every(iNE)) {
        a.style.color = 'red';
        a.textContent = '값이 비었습니다!';
        return;
    }

    if (new Date(d) > new Date(d2)) {
        a.style.color = 'red';
        a.textContent = '입대일이 전역일보다 늦습니다!';
        return;
    }

    const ts = db.transaction(['jjS'], 'readwrite');
    const oS = ts.objectStore('jjS');

    const data = { sM, d, d2, i };

    oS.add(data);
    LDFDB();
    a.textContent = '추가되었습니다.';
};

const rjj = (id) => {
    const ts = db.transaction(['jjS'], 'readwrite');
    const oS = ts.objectStore('jjS');
    
    // 삭제된 데이터와 삭제된 시간을 localstorage에 저장
    const data = oS.get(id);
    data.onsuccess = (event) => {
        const deletedData = event.target.result;
        var d= new Date();
        const deletedTime = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
        localStorage.setItem(deletedTime, JSON.stringify(deletedData));
    };

    oS.delete(id);
};

const crD = (dD) => {
    const today = new Date();
    const rD = (dD - today) / (1000 * 60 * 60 * 24);
    return Math.round(rD);
};

function backupData() {
    const ts = db.transaction(['jjS'], 'readonly');
    const oS = ts.objectStore('jjS');
    const request = oS.getAll();

    request.onsuccess = (event) => {
        const data = event.target.result;
        const jsonData = JSON.stringify(data);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `jjamList_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
}

function restoreData(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const jsonData = event.target.result;
        const data = JSON.parse(jsonData);

        const ts = db.transaction(['jjS'], 'readwrite');
        const oS = ts.objectStore('jjS');

        data.forEach((item) => {
            oS.add(item);
        });

        ts.oncomplete = () => {
            location.reload();
        };
    };

    reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
    const aB = document.querySelector('#add-bt');
    const sM = document.querySelector('#select-menu');
    const d = document.querySelector('#j-date1');
    const d2 = document.querySelector('#j-date2');
    const i = document.querySelector('#j1');

    aB.addEventListener('click', () => {
        ajj(sM.value, d.value, d2.value, i.value);
    });

    i.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            aB.click();
        }
    });

    document.getElementById("fileInput").addEventListener("change", function(event) {
        restoreData(event.target.files[0]);
    });
});

// 