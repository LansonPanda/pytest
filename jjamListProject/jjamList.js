let db; // IndexedDB 데이터베이스 객체
const alert = document.querySelector('span');

// 데이터베이스 열기
const request = indexedDB.open('jjamDB', 1);

// 데이터베이스가 열리면 호출되는 이벤트 리스너
request.onsuccess = (event) => {
    db = event.target.result;
    console.log("IndexedDB가 열렸습니다.");
    loadDataFromIndexedDB();
    alert.style.color = 'blue';
    alert.textContent = '새로운 기동대대원을 추가하세요!';
};

// 데이터베이스 업그레이드가 필요할 때 호출되는 이벤트 리스너
request.onupgradeneeded = (event) => {
    db = event.target.result;
    console.log("IndexedDB 업그레이드가 필요합니다.");

    // 데이터 저장소(테이블) 생성
    const objectStore = db.createObjectStore('jjamStore', { keyPath: 'id', autoIncrement: true });

    // 인덱스 생성
    objectStore.createIndex('selectMenu', 'selectMenu', { unique: false });
    objectStore.createIndex('dateInput1', 'dateInput1', { unique: false });
    objectStore.createIndex('dateInput2', 'dateInput2', { unique: false });
    objectStore.createIndex('input1', 'input1', { unique: false });
};

// 그룹별로 데이터를 분류하고 정렬하는 함수
const groupAndSortData = (data) => {
    const groups = {'1중대': [], '2중대': [], '3중대': [], '본부중대': [], '전역자': []};

    data.forEach((item) => {
        groups[item.selectMenu].push(item);
        console.log(item.selectMenu);
    });

    for (const groupKey in groups) {
        if (groups.hasOwnProperty(groupKey)) {
            const group = groups[groupKey];
            group.sort((a, b) => new Date(a.dateInput1) - new Date(b.dateInput1));
        }
    }

    return groups;
};


// 그룹 이름과 항목들을 화면에 추가하는 함수
const renderGroups = (groups) => {
    const jjamList = document.querySelector('#jjam-list');
    jjamList.innerHTML = '';

    for (const groupKey in groups) {
        if (groups.hasOwnProperty(groupKey)) {
            const group = groups[groupKey];

            const groupElement = document.createElement('div');
            groupElement.classList.add('group');
            groupElement.classList.add(`group-${groupKey.toLowerCase()}`);
            groupElement.textContent = groupKey;

            const groupItemsElement = document.createElement('div');
            groupItemsElement.classList.add('group-items');

            group.forEach((item) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('jjam-item');
                itemElement.setAttribute('data-id', item.id);

                const name = document.createElement('span');
                name.textContent = item.input1;
                name.classList.add('jjam-item-name');

                const enlistmentDate = document.createElement('span');
                enlistmentDate.textContent = ` | ${item.dateInput1}`;
                enlistmentDate.classList.add('jjam-item-date1');

                const dischargeDate = document.createElement('span');
                dischargeDate.textContent = ` ~ ${item.dateInput2}`;
                dischargeDate.classList.add('jjam-item-date2');

                const remainingDays = calculateRemainingDays(new Date(item.dateInput2));
                const remainingText = remainingDays >= 0 ? `${remainingDays}일` : '전역';
                const remainingSpan = document.createElement('span');
                remainingSpan.textContent = ` | ${remainingText}`;
                remainingSpan.classList.add('jjam-item-remainingText');

                const deleteButton = document.createElement('button');

                deleteButton.classList.add('delete-button');
                deleteButton.textContent = '삭제';
                deleteButton.addEventListener('click', () => {
                    const id = item.id;
                    removejjam(id);
                    loadDataFromIndexedDB();
                });

                itemElement.appendChild(name);
                itemElement.appendChild(enlistmentDate);
                itemElement.appendChild(dischargeDate);
                itemElement.appendChild(remainingSpan);
                itemElement.appendChild(deleteButton);


                groupItemsElement.appendChild(itemElement);
            });

            jjamList.appendChild(groupElement);
            jjamList.appendChild(groupItemsElement);
        }
    }
};

// 데이터 로드 함수
const loadDataFromIndexedDB = () => {
    const transaction = db.transaction(['jjamStore'], 'readonly');
    const objectStore = transaction.objectStore('jjamStore');
    const getRequest = objectStore.getAll();

    getRequest.onsuccess = (event) => {
        const data = event.target.result;

        const groups = groupAndSortData(data);
        console.log("1");

        renderGroups(groups);
    };
};


// 항목 추가 함수
const addjjam = (selectMenu, dateInput1, dateInput2, input1) => {
    const isNotEmpty = (value) => value.trim() !== '';

    if (![selectMenu, dateInput1, dateInput2, input1].every(isNotEmpty)) {
        alert.style.color = 'red';
        alert.textContent = '값이 비었습니다!';
        return;
    }

    if (new Date(dateInput1) > new Date(dateInput2)) {
        alert.style.color = 'red';
        alert.textContent = '입대일이 전역일보다 늦습니다!';
        return;
    }

    const transaction = db.transaction(['jjamStore'], 'readwrite');
    const objectStore = transaction.objectStore('jjamStore');

    const data = { selectMenu, dateInput1, dateInput2, input1 };

    objectStore.add(data);
    loadDataFromIndexedDB();
    alert.textContent = '추가되었습니다.';
};


// 항목 삭제 함수
const removejjam = (id) => {
    const transaction = db.transaction(['jjamStore'], 'readwrite');
    const objectStore = transaction.objectStore('jjamStore');

    // 삭제 성공시 데이터 저장
    objectStore.delete(id);
};

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('#add-button');
    const selectMenu = document.querySelector('#select-menu');
    const dateInput1 = document.querySelector('#jjam-date1');
    const dateInput2 = document.querySelector('#jjam-date2');
    const input1 = document.querySelector('#jjam1');

    addButton.addEventListener('click', () => {
        addjjam(selectMenu.value, dateInput1.value, dateInput2.value, input1.value);
    });
});

// 전역일 계산 함수
const calculateRemainingDays = (dischargeDate) => {
    const today = new Date();
    const remainingDays = (dischargeDate - today) / (1000 * 60 * 60 * 24);
    return Math.round(remainingDays);
};