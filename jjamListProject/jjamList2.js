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

    oS.createIndex('sM', 'sM', { unique: false });
    oS.createIndex('d', 'd', { unique: false });
    oS.createIndex('d2', 'd2', { unique: false });
    oS.createIndex('i', 'i', { unique: false });
};

const gASD = (data) => {
    const gps = {'1중대': [], '2중대': [], '3중대': [], '본부중대': [], '전역자': []};

    data.forEach((t) => {
        gps[t.sM].push(t);
    });

    for (const gK in gps) {
        if (gps.hasOwnProperty(gK)) {
            const g = gps[gK];
            g.sort((a, b) => new Date(a.d) - new Date(b.d));
        }
    }

    return gps;
};

const rG = (gps) => {
    const jjJ = document.querySelector('#j-list');
    jjJ.innerHTML = '';

    for (const gK in gps) {
        if (gps.hasOwnProperty(gK)) {
            const g = gps[gK];

            const gE = document.createElement('div');
            gE.classList.add('g');
            gE.classList.add(`g-${gK.toLowerCase()}`);
            gE.textContent = gK;

            const giE = document.createElement('div');
            giE.classList.add('g-ts');

            g.forEach((t) => {
                const iE = document.createElement('div');
                iE.classList.add('j-t');
                iE.setAttribute('data-id', t.id);

                const na = document.createElement('span');
                na.textContent = t.i;
                na.classList.add('j-t-na');

                const eD = document.createElement('span');
                eD.textContent = ` | ${t.d}`;
                eD.classList.add('j-t-date1');

                const dD = document.createElement('span');
                dD.textContent = ` ~ ${t.d2}`;
                dD.classList.add('j-t-date2');

                const rD = crD(new Date(t.d2));
                const rT = rD >= 0 ? `${rD}일` : '전역';
                const rS = document.createElement('span');
                rS.textContent = ` | ${rT}`;
                rS.classList.add('j-t-rT');

                const dBt = document.createElement('bt');

                dBt.classList.add('delete-dBt');
                dBt.textContent = '삭제';
                dBt.addEventListener('click', () => {
                    const id = t.id;
                    rjj(id);
                    LDFDB();
                });

                iE.appendChild(na);
                iE.appendChild(eD);
                iE.appendChild(dD);
                iE.appendChild(rS);
                iE.appendChild(dBt);


                giE.appendChild(iE);
            });

            jjJ.appendChild(gE);
            jjJ.appendChild(giE);
        }
    }
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

    oS.delete(id);
};

document.addEventListener('DOMContentLoaded', () => {
    const aB = document.querySelector('#add-bt');
    const sM = document.querySelector('#select-menu');
    const d = document.querySelector('#j-date1');
    const d2 = document.querySelector('#j-date2');
    const i = document.querySelector('#j1');

    aB.addEventListener('click', () => {
        ajj(sM.value, d.value, d2.value, i.value);
    });
});

const crD = (dD) => {
    const today = new Date();
    const rD = (dD - today) / (1000 * 60 * 60 * 24);
    return Math.round(rD);
};