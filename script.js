// Конфигурация игры
const CONFIG = {
    renderDistance: 6,
    worldSize: 32,
    gravity: -0.05,
    jumpForce: 0.15,
    moveSpeed: 0.1,
    lookSensitivity: 0.002,
    blockTypes: {
        grass: { color: 0x7CFC00, emoji: '🟩' },
        dirt: { color: 0x8B4513, emoji: '🟫' },
        stone: { color: 0x808080, emoji: '⬜' },
        wood: { color: 0xDEB887, emoji: '🟤' }
    }
};

// Инициализация Three.js
const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87CEEB, 10, CONFIG.renderDistance * 10);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 10, 5);

const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: false,
    powerPreference: "low-power"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Ограничиваем для производительности

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);

// Переменные игры
let blocks = [];
let selectedBlockType = 'grass';
let playerVelocity = new THREE.Vector3();
let isJumping = false;
let joystickActive = false;
let joystickVector = new THREE.Vector2();
let cameraTouchStart = { x: 0, y: 0 };
let cameraRotation = { x: 0, y: 0 };
let lastTime = performance.now();
let fps = 60;

// Генерация мира
function generateWorld() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    for (let x = -CONFIG.worldSize/2; x < CONFIG.worldSize/2; x++) {
        for (let z = -CONFIG.worldSize/2; z < CONFIG.worldSize/2; z++) {
            // Создаем простой ландшафт с холмами
            const height = Math.floor(Math.sin(x * 0.2) * Math.cos(z * 0.2) * 3) + 8;
            
            for (let y = 0; y < height; y++) {
                let blockType;
                if (y === height - 1) blockType = 'grass';
                else if (y > height - 4) blockType = 'dirt';
                else blockType = 'stone';
                
                addBlock(x, y, z, blockType);
            }
        }
    }
    
    // Добавляем деревья
    for (let i = 0; i < 20; i++) {
        const x = Math.floor(Math.random() * CONFIG.worldSize) - CONFIG.worldSize/2;
        const z = Math.floor(Math.random() * CONFIG.worldSize) - CONFIG.worldSize/2;
        const height = getTerrainHeight(x, z);
        
        if (height > 5) {
            // Ствол
            for (let y = height; y < height + 5; y++) {
                addBlock(x, y, z, 'wood');
            }
            
            // Листва
            for (let dx = -2; dx <= 2; dx++) {
                for (let dy = 0; dy <= 2; dy++) {
                    for (let dz = -2; dz <= 2; dz++) {
                        if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) <= 3) {
                            addBlock(x + dx, height + 4 + dy, z + dz, 'grass');
                        }
                    }
                }
            }
        }
    }
}

function addBlock(x, y, z, type) {
    const material = new THREE.MeshLambertMaterial({ 
        color: CONFIG.blockTypes[type].color 
    });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    cube.position.set(x, y, z);
    cube.userData.type = type;
    scene.add(cube);
    blocks.push(cube);
}

function getTerrainHeight(x, z) {
    return Math.floor(Math.sin(x * 0.2) * Math.cos(z * 0.2) * 3) + 8;
}

// Управление джойстиком
const joystickBase = document.getElementById('joystickBase');
const joystickHandle = document.getElementById('joystickHandle');
let joystickStartPos = { x: 0, y: 0 };

joystickBase.addEventListener('touchstart', (e) => {
    e.preventDefault();
    joystickActive = true;
    const rect = joystickBase.getBoundingClientRect();
    joystickStartPos.x = rect.left + rect.width / 2;
    joystickStartPos.y = rect.top + rect.height / 2;
});

document.addEventListener('touchmove', (e) => {
    if (!joystickActive) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - joystickStartPos.x;
    const deltaY = touch.clientY - joystickStartPos.y;
    
    // Ограничиваем движение джойстика
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 40);
    const angle = Math.atan2(deltaY, deltaX);
    
    joystickVector.x = Math.cos(angle) * (distance / 40);
    joystickVector.y = Math.sin(angle) * (distance / 40);
    
    // Обновляем позицию ручки джойстика
    joystickHandle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
});

document.addEventListener('touchend', (e) => {
    joystickActive = false;
    joystickVector.set(0, 0);
    joystickHandle.style.transform = 'translate(0, 0)';
});

// Управление камерой
const cameraTouchArea = document.getElementById('cameraTouchArea');
let cameraTouchActive = false;

cameraTouchArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
    cameraTouchActive = true;
    cameraTouchStart.x = e.touches[0].clientX;
    cameraTouchStart.y = e.touches[0].clientY;
});

cameraTouchArea.addEventListener('touchmove', (e) => {
    if (!cameraTouchActive) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - cameraTouchStart.x;
    const deltaY = touch.clientY - cameraTouchStart.y;
    
    cameraRotation.y -= deltaX * CONFIG.lookSensitivity;
    cameraRotation.x -= deltaY * CONFIG.lookSensitivity;
    cameraRotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRotation.x));
    
    cameraTouchStart.x = touch.clientX;
    cameraTouchStart.y = touch.clientY;
});

cameraTouchArea.addEventListener('touchend', () => {
    cameraTouchActive = false;
});

// Кнопки действий
document.getElementById('jumpBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isJumping) {
        playerVelocity.y = CONFIG.jumpForce;
        isJumping = true;
    }
});

document.getElementById('placeBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    placeBlock();
});

document.getElementById('destroyBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    removeBlock();
});

// Выбор блоков
document.querySelectorAll('.blockSlot').forEach(slot => {
    slot.addEventListener('touchstart', (e) => {
        e.preventDefault();
        document.querySelectorAll('.blockSlot').forEach(s => s.classList.remove('active'));
        slot.classList.add('active');
        selectedBlockType = slot.dataset.type;
    });
});

// Кнопка меню
document.getElementById('menuBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    alert('Меню игры\n\nУправление:\n• Джойстик слева - движение\n• Касание справа - камера\n• Кнопки справа - действия\n• Панель снизу - выбор блоков');
});

// Функции игры
function placeBlock() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    const intersects = raycaster.intersectObjects(blocks);
    if (intersects.length > 0) {
        const intersect = intersects[0];
        const normal = intersect.face.normal;
        const newPos = intersect.object.position.clone().add(normal);
        
        // Проверяем, не занята ли позиция
        const exists = blocks.some(block => 
            block.position.equals(newPos)
        );
        
        if (!exists) {
            addBlock(newPos.x, newPos.y, newPos.z, selectedBlockType);
        }
    }
}

function removeBlock() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    const intersects = raycaster.intersectObjects(blocks);
    if (intersects.length > 0) {
        const block = intersects[0].object;
        scene.remove(block);
        blocks = blocks.filter(b => b !== block);
    }
}

// Обновление позиции игрока
function updatePlayer() {
    // Применяем гравитацию
    playerVelocity.y += CONFIG.gravity;
    
    // Движение от джойстика
    const moveX = joystickVector.x;
    const moveZ = joystickVector.y;
    
    // Поворачиваем движение относительно камеры
    const angle = cameraRotation.y;
    const moveDir = new THREE.Vector3(
        moveX * Math.cos(angle) - moveZ * Math.sin(angle),
        0,
        moveX * Math.sin(angle) + moveZ * Math.cos(angle)
    );
    
    // Обновляем позицию
    camera.position.x += moveDir.x * CONFIG.moveSpeed;
    camera.position.z += moveDir.z * CONFIG.moveSpeed;
    camera.position.y += playerVelocity.y;
    
    // Проверка столкновений с землей
    if (camera.position.y < 2) {
        camera.position.y = 2;
        playerVelocity.y = 0;
        isJumping = false;
    }
    
    // Обновление вращения камеры
    camera.rotation.order = 'YXZ';
    camera.rotation.y = cameraRotation.y;
    camera.rotation.x = cameraRotation.x;
    
    // Обновляем информацию о позиции
    updatePositionInfo();
}

function updatePositionInfo() {
    document.getElementById('positionInfo').textContent = 
        `X: ${Math.floor(camera.position.x)} Y: ${Math.floor(camera.position.y)} Z: ${Math.floor(camera.position.z)}`;
}

// FPS счетчик
function updateFPS() {
    const now = performance.now();
    const delta = now - lastTime;
    fps = Math.round(1000 / delta);
    lastTime = now;
    
    document.getElementById('fpsCounter').textContent = `FPS: ${fps}`;
}

// Адаптация к изменению размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Игровой цикл
function gameLoop() {
    updatePlayer();
    updateFPS();
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

// Запуск игры
function initGame() {
    generateWorld();
    updatePositionInfo();
    gameLoop();
    console.log('Игра запущена! Управление адаптировано для мобильных устройств.');
}

// Запускаем игру при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Предотвращаем контекстное меню
document.addEventListener('contextmenu', e => e.preventDefault());
