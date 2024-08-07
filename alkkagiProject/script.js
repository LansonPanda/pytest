let currentPlayer = 1;
let marbles = [];
let selectedMarble = null;
let isRotating = false;
let isChargingPower = false;
let chargingStartTime;
let isMarbleLocked = false;  

const FRICTION = 0.96; //96
const ELASTIC = 0.8; //8

function initGame() {
    //-------------------------------------------------------
    const numMarbles = prompt('말을 몇개씩 생성할까요?', 5);
    marbles = [];
    for (let i = 0; i < numMarbles * 2; i++) {
        marbles.push({
            x: Math.random() * 580,
            y: Math.random() * 580,
            vx: 0,
            vy: 0,
            radius: 14,
            player: i < numMarbles ? 1 : 2
        });
    }
    //-------------------------------------------------------
    renderMarbles();
    updateControls();

}

function renderMarbles() {
    const board = document.getElementById('game-board');
    board.innerHTML = '<div id="arrow"></div>';
    marbles.forEach((marble, index) => {
        const div = document.createElement('div');
        div.className = 'marble';
        div.style.left = `${marble.x - marble.radius}px`;
        div.style.top = `${marble.y - marble.radius}px`;
        div.style.backgroundColor = marble.player === 1 ? 'black' : 'white';
        div.style.width = `${marble.radius * 2}px`;
        div.style.height = `${marble.radius * 2}px`;
        div.addEventListener('click', () => selectMarble(index));
        board.appendChild(div);
    });
}

function selectMarble(index) {
    if (isMarbleLocked) return;

    const marble = marbles[index];
    if (marble.player === currentPlayer && Math.abs(marble.vx) < 0.1 && Math.abs(marble.vy) < 0.1) {
        selectedMarble = marble;
        isRotating = true;
        rotateAngle();
        updateArrow();
    }
}

function updateArrow() {
    const arrow = document.getElementById('arrow');
    if (selectedMarble) {
        arrow.style.display = 'block';
        arrow.style.left = `${selectedMarble.x}px`;
        arrow.style.top = `${selectedMarble.y-75}px`;
        const angle = document.getElementById('angle').value;
        a = Number(angle);
        if (a < 270) {
            a += 90;
        } else {
            a -= 270;
        }
        arrow.style.transform = `rotate(${a}deg)`;
    } else {
        arrow.style.display = 'none';
    }
}

function updateControls() {
    document.getElementById('player-turn').textContent = `플레이어 ${currentPlayer} 차례`;
    document.getElementById('left-marbles').textContent = `흑 : ${marbles.filter(m => m.player === 1).length} 백 : ${marbles.filter(m => m.player === 2).length}`;
    document.getElementById('angle').addEventListener('input', updateArrow);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    //----------------------------------------------------------------
    const marble = marbles.find(m => m.player === currentPlayer);
    if (marble) {
        selectMarble(marbles.indexOf(marble));
    }
    document.addEventListener('keydown', handleArrowKeys);
    //----------------------------------------------------------------
}

//----------------------------------------------------------------
function handleArrowKeys(e) {
    if (e.code === 'ArrowRight' && selectedMarble) {
        const currentIndex = marbles.indexOf(selectedMarble);
        const nextIndex = (currentIndex + 1) % marbles.length;
        selectMarble(nextIndex);
    }
    if (e.code === 'ArrowLeft' && selectedMarble) {
        const currentIndex = marbles.indexOf(selectedMarble);
        const nextIndex = (currentIndex - 1 + marbles.length) % marbles.length;
        selectMarble(nextIndex);
    }
}
//----------------------------------------------------------------
function rotateAngle() {
    const angleInput = document.getElementById('angle');
    let currentAngle = parseInt(angleInput.value);
  
    function incrementAngle() {
        if (!isRotating) return;
        currentAngle = (currentAngle + 2) % 361;
        angleInput.value = currentAngle;
        updateArrow();
        setTimeout(incrementAngle, 1);
    }
  
    incrementAngle();
}

  
function handleShoot(power) {
    if (selectedMarble) {
        const angle = document.getElementById('angle').value;
        const radians = angle * Math.PI / 180;
        selectedMarble.vx = Math.cos(radians) * power / 10;
        selectedMarble.vy = Math.sin(radians) * power / 10;
        selectedMarble = null;
        isMarbleLocked = false;
        document.getElementById('arrow').style.display = 'none';
        animate();
    }
}

function handleKeyDown(e) {
    if (e.code === 'Space' && selectedMarble) {
        if (!isChargingPower) {
            isRotating = false;
            isChargingPower = true;
            isMarbleLocked = true;
            chargingStartTime = Date.now();
            chargePower();
        }
    }
}

function handleKeyUp(e) {
    if (e.code === 'Space' && isChargingPower) {
        isChargingPower = false;
        const power = calculatePower();
        handleShoot(power);
    }
}

function resetTurnState() {
    isRotating = false;
    isChargingPower = false;
    isMarbleLocked = false;
    selectedMarble = null;
    document.getElementById('arrow').style.display = 'none';
}

function chargePower() {
    if (!isChargingPower) return;
    const elapsedTime = Math.min(Date.now() - chargingStartTime, 1000);
    const power = Math.min(elapsedTime / 3, 300);
    document.getElementById('power').value = power;
    requestAnimationFrame(chargePower);
}

function calculatePower() {
    const elapsedTime = Math.min(Date.now() - chargingStartTime, 1000);
    
    return Math.min(elapsedTime / 4, 300);
}

function animate() {
    let isMoving = false;
    marbles.forEach(marble => {
        marble.x += marble.vx;
        marble.y += marble.vy;
        marble.vx *= FRICTION;
        marble.vy *= FRICTION;
        if (Math.abs(marble.vx) > 0.1 || Math.abs(marble.vy) > 0.1) {
            isMoving = true;
        }
    });

    for (let i = 0; i < marbles.length; i++) {
        for (let j = i + 1; j < marbles.length; j++) {
            checkCollision(marbles[i], marbles[j]);
        }
    }

    marbles = marbles.filter(marble => 
        marble.x >= 0 && marble.x <= 600 && marble.y >= 0 && marble.y <= 600
    );

    renderMarbles();

    if (isMoving) {
        requestAnimationFrame(animate);
    } else {
        if (checkGameOver()) {
            alert(`플레이어 ${currentPlayer} 승리!`);
            initGame();
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            resetTurnState();
            updateControls();
        }
    }
}

function checkCollision(marble1, marble2) {
    const dx = marble2.x - marble1.x;
    const dy = marble2.y - marble1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < marble1.radius + marble2.radius) {
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const vx1 = marble1.vx * cos + marble1.vy * sin;
        const vy1 = marble1.vy * cos - marble1.vx * sin;
        const vx2 = marble2.vx * cos + marble2.vy * sin;
        const vy2 = marble2.vy * cos - marble2.vx * sin;

        const finalVx1 = vx2;
        const finalVx2 = vx1;

        marble1.vx = cos * finalVx1 - sin * vy1;
        marble1.vy = sin * finalVx1 + cos * vy1;
        marble2.vx = cos * finalVx2 - sin * vy2;
        marble2.vy = sin * finalVx2 + cos * vy2;

        const overlap = (marble1.radius + marble2.radius - distance) / 2;
        marble1.x -= overlap * cos;
        marble1.y -= overlap * sin;
        marble2.x += overlap * cos;
        marble2.y += overlap * sin;
    }
}

function checkGameOver() {
    return marbles.filter(m => m.player === 1).length === 0 || marbles.filter(m => m.player === 2).length === 0;
}

initGame();