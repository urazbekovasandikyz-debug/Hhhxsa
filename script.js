// КОНФИГУРАЦИЯ ИГРЫ
const CONFIG = {
    GAME_TITLE: "THE TRE GEIMING",
    VERSION: "1.0.0",
    
    // Настройки миров
    WORLD_SIZES: {
        tiny: { width: 16, height: 16, name: "Очень маленький" },
        small: { width: 32, height: 32, name: "Маленький" },
        medium: { width: 48, height: 48, name: "Средний" },
        large: { width: 64, height: 64, name: "Большой" }
    },
    
    WORLD_TYPES: {
        normal: { name: "Нормальный", height: 1.0, trees: true },
        flat: { name: "Плоский", height: 0.1, trees: false },
        mountains: { name: "Горы", height: 2.0, trees: true },
        islands: { name: "Острова", height: 1.5, trees: true }
    },
    
    // Настройки игры
    GRAVITY: -0.05,
    JUMP_FORCE: 0.15,
    MOVE_SPEED: 0.1,
    LOOK_SENSITIVITY: 0.002,
    RENDER_DISTANCE: 6,
    
    // Блоки
    BLOCKS: {
        grass: { color: 0x7CFC00, name: "Трава" },
        dirt: { color: 0x8B4513, name: "Земля" },
        stone: { color: 0x808080, name: "Камень" },
        wood: { color: 0xDEB887, name: "Дерево" },
        glass: { color: 0x87CEEB, name: "Стекло", transparent: true }
    },
    
    // Цвета
    COLORS: {
        sky: 0x87CEEB,
        fog: 0x87CEEB,
        ambient: 0xffffff,
        directional: 0xffffff
    },
    
    // Сохранение
    STORAGE_KEY: "tre_geiming_save"
};

// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let scene, camera, renderer;
let world = {
    name: "Новый мир",
    seed: Date.now(),
    size: "tiny",
    type: "normal",
    blocks: [],
    createdAt: Date.now(),
    lastPlayed: Date.now()
};
let player = {
    position: new THREE.Vector3(0, 20, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Vector2(0, 0),
    selectedBlock: "grass",
    isJumping: false,
    health: 20,
    hunger: 20
};
let joystick = {
    active: false,
    vector: new THREE.Vector2(0, 0),
    basePosition: { x: 0, y: 0 },
    handleElement: null
};
let cameraTouch = {
    active: false,
    startPosition: { x: 0, y: 0 }
};
let gameState = "start";
let worlds = [];
let blocks = [];
let lastTime = 0;
let fps = 60;
let gameTime = 0;
let sessionStartTime = 0;
let distanceWalked = 0;
let lastPosition = new THREE.Vector3();
let loadTimeout = null;
let isGenerating = false;

// ЗАГРУЗКА ИГРЫ
window.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// ИНИЦИАЛИЗАЦИЯ ИГРЫ
function initGame() {
    loadGameData();
    setupEventListeners();
    showScreen('startScreen');
    updateWorldStats();
    
    // Показываем подсказку управления
    setTimeout(() => {
        showControlHint();
    }, 1000);
}

// ЗАГРУЗКА ДАННЫХ
function loadGameData() {
    const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            worlds = data.worlds || [];
            console.log(`Загружено ${worlds.length} миров`);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            worlds = [];
        }
    }
}

// СОХРАНЕНИЕ ДАННЫХ
function saveGameData() {
    const data = {
        worlds: worlds,
        version: CONFIG.VERSION,
        lastSave: Date.now()
    };
    
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

// ПОКАЗАТЬ ПОДСКАЗКУ УПРАВЛЕНИЯ
function showControlHint() {
    if (!localStorage.getItem('control_hint_shown')) {
        alert('👋 Добро пожаловать в The Tre Geiming!\n\n' +
              '🎮 Управление:\n' +
              '• Джойстик слева - движение\n' +
              '• Касание справа - вращение камеры\n' +
              '• Кнопки справа - действия\n\n' +
              'Создайте свой первый мир!');
        localStorage.setItem('control_hint_shown', 'true');
    }
}

// ОБНОВЛЕНИЕ СТАТИСТИКИ МИРОВ
function updateWorldStats() {
    const totalWorlds = document.getElementById('totalWorlds');
    const totalBlocks = document.getElementById('totalBlocks');
    
    if (totalWorlds) {
        totalWorlds.textContent = `Миров: ${worlds.length}`;
    }
    
    if (totalBlocks) {
        let blocksCount = 0;
        worlds.forEach(world => {
            blocksCount += world.blocks ? world.blocks.length : 0;
        });
        totalBlocks.textContent = `Блоков: ${blocksCount}`;
    }
}

// ОБНОВЛЕНИЕ СПИСКА МИРОВ
function updateWorldList() {
    const container = document.getElementById('worldsContainer');
    const noWorldsMessage = document.getElementById('noWorldsMessage');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (worlds.length === 0) {
        if (noWorldsMessage) {
            noWorldsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noWorldsMessage) {
        noWorldsMessage.style.display = 'none';
    }
    
    // Сортируем миры по дате последней игры
    worlds.sort((a, b) => b.lastPlayed - a.lastPlayed);
    
    worlds.forEach((world, index) => {
        const worldElement = document.createElement('div');
        worldElement.className = 'world-item';
        worldElement.innerHTML = `
            <div class="world-item-info">
                <div class="world-item-name">${world.name}</div>
                <div class="world-item-details">
                    <span>${CONFIG.WORLD_SIZES[world.size].name}</span>
                    <span>•</span>
                    <span>${CONFIG.WORLD_TYPES[world.type].name}</span>
                    <span>•</span>
                    <span>${formatDate(world.lastPlayed)}</span>
                </div>
            </div>
            <div class="world-item-actions">
                <button class="world-item-btn play-world-btn" data-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
                <button class="world-item-btn delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(worldElement);
    });
    
    // Добавляем обработчики
    document.querySelectorAll('.play-world-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            loadWorld(index);
        });
    });
    
    document.querySelectorAll('.world-item-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(e.currentTarget.dataset.index);
            deleteWorld(index);
        });
    });
}

// ФОРМАТИРОВАНИЕ ДАТЫ
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
        return 'Только что';
    } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} мин назад`;
    } else if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} ч назад`;
    } else {
        return date.toLocaleDateString('ru-RU');
    }
}

// ЗАГРУЗКА МИРА
function loadWorld(index) {
    if (index >= 0 && index < worlds.length) {
        world = JSON.parse(JSON.stringify(worlds[index]));
        world.lastPlayed = Date.now();
        
        // Обновляем мир в списке
        worlds[index] = world;
        saveGameData();
        
        startGame();
    }
}

// УДАЛЕНИЕ МИРА
function deleteWorld(index) {
    if (index >= 0 && index < worlds.length) {
        if (confirm(`Удалить мир "${worlds[index].name}"?`)) {
            worlds.splice(index, 1);
            saveGameData();
            updateWorldList();
            updateWorldStats();
        }
    }
}

// ПОКАЗ ЭКРАНА
function showScreen(screenName) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Скрываем список миров
    const worldsList = document.getElementById('worldsList');
    if (worldsList) {
        worldsList.classList.add('hidden');
    }
    
    // Показываем нужный экран
    const screen = document.getElementById(screenName + 'Screen');
    if (screen) {
        screen.classList.add('active');
        gameState = screenName;
    }
}

// НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
function setupEventListeners() {
    // Кнопки главного меню
    document.getElementById('playBtn').addEventListener('click', () => {
        if (worlds.length === 0) {
            showScreen('create');
        } else {
            updateWorldList();
            const worldsList = document.getElementById('worldsList');
            worldsList.classList.remove('hidden');
        }
    });
    
    document.getElementById('createWorldBtn').addEventListener('click', () => {
        showScreen('create');
    });
    
    document.getElementById('settingsBtn').addEventListener('click', () => {
        showSettings();
    });
    
    document.getElementById('helpBtn').addEventListener('click', () => {
        showHelp();
    });
    
    document.getElementById('closeWorldsBtn').addEventListener('click', () => {
        const worldsList = document.getElementById('worldsList');
        worldsList.classList.add('hidden');
    });
    
    // Кнопки создания мира
    document.getElementById('backBtn').addEventListener('click', () => {
        showScreen('start');
    });
    
    document.getElementById('generateBtn').addEventListener('click', generateWorld);
    
    // Выбор размера мира
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
        });
    });
    
    // Выбор типа мира
    document.querySelectorAll('.type-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.type-option').forEach(opt => {
                opt.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
        });
    });
    
    // Счетчик символов в названии
    const worldNameInput = document.getElementById('worldName');
    const charCount = document.querySelector('.char-count');
    
    if (worldNameInput && charCount) {
        worldNameInput.addEventListener('input', () => {
            const length = worldNameInput.value.length;
            charCount.textContent = `${length}/20`;
            
            if (length > 20) {
                charCount.style.color = '#ff4444';
            } else {
                charCount.style.color = 'rgba(255, 255, 255, 0.5)';
            }
        });
        
        worldNameInput.dispatchEvent(new Event('input'));
    }
    
    // Кнопка отмены загрузки
    document.getElementById('cancelLoadingBtn')?.addEventListener('click', () => {
        if (gameState === 'loading') {
            isGenerating = false;
            if (loadTimeout) clearTimeout(loadTimeout);
            showScreen('start');
        }
    });
    
    // Джойстик
    setupJoystick();
    
    // Управление камерой
    setupCameraControls();
    
    // Игровые кнопки
    setupGameControls();
    
    // Изменение размера окна
    window.addEventListener('resize', onWindowResize);
    
    // Предотвращаем контекстное меню
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Предотвращаем масштабирование
    document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
}

// НАСТРОЙКА ДЖОЙСТИКА
function setupJoystick() {
    const joystickBase = document.getElementById('joystickBase');
    const joystickHandle = document.getElementById('joystickHandle');
    
    if (!joystickBase || !joystickHandle) return;
    
    joystick.handleElement = joystickHandle;
    
    let isTouching = false;
    
    joystickBase.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isTouching = true;
        joystick.active = true;
        
        const rect = joystickBase.getBoundingClientRect();
        joystick.basePosition.x = rect.left + rect.width / 2;
        joystick.basePosition.y = rect.top + rect.height / 2;
        
        updateJoystick(e.touches[0]);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isTouching || !joystick.active) return;
        e.preventDefault();
        
        if (e.touches.length > 0) {
            updateJoystick(e.touches[0]);
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (isTouching) {
            isTouching = false;
            joystick.active = false;
            joystick.vector.set(0, 0);
            
            if (joystickHandle) {
                joystickHandle.style.transform = 'translate(0, 0)';
            }
        }
    });
    
    function updateJoystick(touch) {
        const deltaX = touch.clientX - joystick.basePosition.x;
        const deltaY = touch.clientY - joystick.basePosition.y;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 35;
        
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            const limitedX = Math.cos(angle) * maxDistance;
            const limitedY = Math.sin(angle) * maxDistance;
            
            joystickHandle.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
            joystick.vector.x = limitedX / maxDistance;
            joystick.vector.y = limitedY / maxDistance;
        } else {
            joystickHandle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            joystick.vector.x = deltaX / maxDistance;
            joystick.vector.y = deltaY / maxDistance;
        }
    }
}

// НАСТРОЙКА УПРАВЛЕНИЯ КАМЕРОЙ
function setupCameraControls() {
    const cameraArea = document.getElementById('cameraArea');
    
    if (!cameraArea) return;
    
    cameraArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        cameraTouch.active = true;
        cameraTouch.startPosition.x = e.touches[0].clientX;
        cameraTouch.startPosition.y = e.touches[0].clientY;
    });
    
    cameraArea.addEventListener('touchmove', (e) => {
        if (!cameraTouch.active) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - cameraTouch.startPosition.x;
        const deltaY = touch.clientY - cameraTouch.startPosition.y;
        
        player.rotation.y -= deltaX * CONFIG.LOOK_SENSITIVITY;
        player.rotation.x -= deltaY * CONFIG.LOOK_SENSITIVITY;
        
        player.rotation.x = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, player.rotation.x)
        );
        
        cameraTouch.startPosition.x = touch.clientX;
        cameraTouch.startPosition.y = touch.clientY;
    });
    
    cameraArea.addEventListener('touchend', () => {
        cameraTouch.active = false;
    });
}

// НАСТРОЙКА ИГРОВЫХ КНОПОК
function setupGameControls() {
    // Кнопка прыжка
    document.getElementById('jumpBtn')?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!player.isJumping) {
            player.velocity.y = CONFIG.JUMP_FORCE;
            player.isJumping = true;
        }
    });
    
    // Кнопка размещения блока
    document.getElementById('placeBtn')?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        placeBlock();
    });
    
    // Кнопка разрушения блока
    document.getElementById('breakBtn')?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        breakBlock();
    });
    
    // Кнопка инвентаря
    document.getElementById('inventoryBtn')?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showInventory();
    });
    
    // Кнопка меню
    document.getElementById('menuBtn')?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        togglePause();
    });
    
    // Кнопки в меню паузы
    document.getElementById('resumeBtn')?.addEventListener('click', () => {
        togglePause();
    });
    
    document.getElementById('saveBtn')?.addEventListener('click', () => {
        saveCurrentWorld();
    });
    
    document.getElementById('settingsGameBtn')?.addEventListener('click', () => {
        showSettings();
    });
    
    document.getElementById('exitBtn')?.addEventListener('click', () => {
        exitToMenu();
    });
    
    // Выбор блоков
    document.querySelectorAll('.block-slot').forEach(slot => {
        slot.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll('.block-slot').forEach(s => {
                s.classList.remove('active');
            });
            
            slot.classList.add('active');
            player.selectedBlock = slot.dataset.block;
            
            const blockName = CONFIG.BLOCKS[player.selectedBlock].name;
            showActionIndicator(`Выбран: ${blockName}`);
        });
    });
}

// ГЕНЕРАЦИЯ МИРА
function generateWorld() {
    const worldName = document.getElementById('worldName').value.trim() || 'Мой мир';
    const worldSize = document.querySelector('.size-option.active')?.dataset.size || 'tiny';
    const worldType = document.querySelector('.type-option.active')?.dataset.type || 'normal';
    const worldSeedInput = document.getElementById('worldSeed').value.trim();
    
    let worldSeed;
    if (worldSeedInput) {
        worldSeed = Array.from(worldSeedInput).reduce((hash, char) => {
            return ((hash << 5) - hash) + char.charCodeAt(0);
        }, 0);
    } else {
        worldSeed = Date.now();
    }
    
    world = {
        name: worldName,
        seed: worldSeed,
        size: worldSize,
        type: worldType,
        blocks: [],
        createdAt: Date.now(),
        lastPlayed: Date.now()
    };
    
    worlds.unshift(world);
    saveGameData();
    
    startGame();
}

// ЗАПУСК ИГРЫ
async function startGame() {
    showScreen('loading');
    
    // Обновляем текст загрузки
    updateLoadingText('Инициализация...', 0);
    
    // Таймаут безопасности
    loadTimeout = setTimeout(() => {
        if (gameState === 'loading') {
            alert('Генерация мира занимает слишком много времени. Попробуйте создать мир меньшего размера.');
            showScreen('start');
        }
    }, 30000);
    
    try {
        // Инициализируем Three.js
        initThreeJS();
        
        // Даем время на инициализацию
        await sleep(100);
        updateLoadingProgress(10);
        
        // Генерируем мир
        isGenerating = true;
        await generateWorldTerrain();
        
        if (!isGenerating) return; // Если генерация была отменена
        
        // Даем время на рендеринг
        updateLoadingText('Запуск игры...', 95);
        await sleep(300);
        
        // Показываем игровой экран
        showScreen('game');
        gameState = 'playing';
        sessionStartTime = Date.now();
        lastPosition.copy(player.position);
        
        // Запускаем игровой цикл
        gameLoop();
        
        // Обновляем статистику
        updatePauseStats();
        
        // Показываем подсказку
        setTimeout(() => {
            showActionIndicator('Добро пожаловать в The Tre Geiming!');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка запуска игры:', error);
        alert('Ошибка генерации мира. Попробуйте создать мир меньшего размера.');
        showScreen('start');
    } finally {
        if (loadTimeout) clearTimeout(loadTimeout);
    }
}

// СОН (ожидание)
function sleep(ms) {
    return new Promise(resolve => setTimeout(r
