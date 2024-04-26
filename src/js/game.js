

// 获取计时器元素
const timerElement = document.getElementById('timer');

// 定义计时器变量和初始时间
let timerInterval;
let timeLeft = 300; // 初始时间为 5 分钟

// 在游戏加载时启动计时器
startTimer();

// 启动计时器函数
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// 更新计时器函数
function updateTimer() {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.innerText = `Timer: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // 时间到时，停止计时器并结束游戏
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Time's up! Game over!");
        window.location.reload();
    }
}

// 重新生成迷宫按钮的点击事件处理
document.getElementById('regenerateMaze').addEventListener('click', () => {
    localStorage.getItem('lifetimeScore') ? localStorage.setItem('lifetimeScore', parseInt(localStorage.getItem('lifetimeScore')) - 1) : localStorage.setItem('lifetimeScore', 0);
    window.location.reload();
});

// 其他游戏逻辑代码...






document.getElementById('regenerateMaze').addEventListener('click', () => {
    localStorage.getItem('lifetimeScore') ? localStorage.setItem('lifetimeScore', parseInt(localStorage.getItem('lifetimeScore')) - 1) : localStorage.setItem('lifetimeScore', 0);
    window.location.reload();
});

document.getElementById('lifetimeScore').innerText = localStorage.getItem('lifetimeScore') ? `Lifetime Score: ${localStorage.getItem('lifetimeScore')}` : 'Lifetime Score: 0';

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const rows = 15;
const cols = 20;
const cellSize = canvas.width / cols;
const maze = [];

for (let y = 0; y < rows; y++) {
    maze[y] = [];
    for (let x = 0; x < cols; x++) {
        maze[y][x] = 1;
    }
}

const player = {
    x: 0,
    y: 0,
    size: cellSize / 2,
    color: 'red',
    path: [] // 存储轨迹的数组
};

let exit = {
    x: cols - 1,
    y: rows - 1,
    size: cellSize,
    color: 'green'
};

function carvePassagesFrom(x, y) {
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    directions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < directions.length; i++) {
        const dx = directions[i][0];
        const dy = directions[i][1];
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 1) {
            maze[y + dy][x + dx] = 0;
            maze[ny][nx] = 0;
            carvePassagesFrom(nx, ny);
        }
    }
}

maze[0][0] = 0;
carvePassagesFrom(0, 0);
maze[rows - 1][cols - 1] = 0;

function drawMaze() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? 'black' : 'white';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawPlayer() {
    // 先画出当前位置的玩家
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * cellSize + (cellSize - player.size) / 2, player.y * cellSize + (cellSize - player.size) / 2, player.size, player.size);
    // 再画出轨迹
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // 设置轨迹的颜色和透明度
    player.path.forEach((point) => {
        ctx.fillRect(point.x * cellSize + (cellSize - player.size) / 2, point.y * cellSize + (cellSize - player.size) / 2, player.size, player.size);
    });
}

function drawExit() {
    ctx.fillStyle = exit.color;
    ctx.fillRect(exit.x * cellSize, exit.y * cellSize, exit.size, exit.size);
}

function checkCollision(x, y) {
    return maze[y][x] === 1;
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !checkCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
         // 记录轨迹
        player.path.push({x: newX, y: newY});
    }
}




function checkWin() {
    if (player.x === exit.x && player.y === exit.y) {
        localStorage.getItem('lifetimeScore') ? localStorage.setItem('lifetimeScore', parseInt(localStorage.getItem('lifetimeScore')) + 1) : localStorage.setItem('lifetimeScore', 1);
        alert("Congratulations, you've escaped the maze! Now we dare you to do it again! FYI, your lifetime score is currently: " + localStorage.getItem('lifetimeScore'));
        window.location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPlayer();
    drawExit();
    requestAnimationFrame(draw);
}

draw();

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            e.preventDefault();
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            e.preventDefault();
            break;
    }
    checkWin();
});

document.getElementById('moveUp').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('moveDown').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('moveLeft').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('moveRight').addEventListener('click', () => movePlayer(1, 0));