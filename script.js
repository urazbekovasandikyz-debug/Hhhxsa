* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    touch-action: manipulation;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    position: fixed;
}

/* Общие стили экранов */
.screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    z-index: 10;
}

.screen.active {
    display: block;
}

/* Начальный экран */
#startScreen {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23222"/><path d="M0,50 L100,50 M50,0 L50,100" stroke="%23333" stroke-width="0.5"/></svg>');
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 30px 20px;
}

.title-container {
    text-align: center;
    margin-top: 40px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.game-title {
    font-size: 3.5rem;
    background: linear-gradient(45deg, #00b4d8, #90e0ef);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 5px 15px rgba(0, 180, 216, 0.3);
    letter-spacing: 2px;
    margin-bottom: 10px;
}

.title-sub {
    font-size: 1.2rem;
    color: #90e0ef;
    opacity: 0.8;
}

.menu-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 400px;
}

.menu-btn {
    background: linear-gradient(145deg, rgba(0, 180, 216, 0.2), rgba(144, 224, 239, 0.1));
    border: 2px solid rgba(0, 180, 216, 0.3);
    color: white;
    padding: 20px;
    font-size: 1.3rem;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    transition: all 0.3s;
}

.menu-btn i {
    font-size: 1.5rem;
}

.menu-btn:active {
    transform: scale(0.95);
    background: linear-gradient(145deg, rgba(0, 180, 216, 0.3), rgba(144, 224, 239, 0.2));
}

.world-list {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    padding: 20px;
    width: 100%;
    max-width: 400px;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 20px;
}

.world-list h3 {
    color: #90e0ef;
    margin-bottom: 10px;
    font-size: 1.2rem;
}

.world-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 12px 15px;
    border-radius: 10px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
}

.world-item:active {
    background: rgba(255, 255, 255, 0.2);
}

.world-info {
    flex: 1;
}

.world-name {
    font-weight: bold;
    font-size: 1.1rem;
}

.world-details {
    font-size: 0.9rem;
    opacity: 0.8;
}

.world-actions {
    display: flex;
    gap: 10px;
}

.world-btn {
    background: rgba(0, 180, 216, 0.3);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer {
    margin-top: auto;
    text-align: center;
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
}

.controls-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

/* Экран создания мира */
#createScreen {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 30px 20px;
}

.screen-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.screen-header h2 {
    color: #90e0ef;
    font-size: 1.8rem;
}

.back-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-container {
    max-width: 500px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #90e0ef;
    font-size: 1.1rem;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: white;
    font-size: 1rem;
}

.form-group input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.generate-btn {
    background: linear-gradient(45deg, #00b4d8, #90e0ef);
    color: white;
    border: none;
    padding: 20px;
    font-size: 1.3rem;
    border-radius: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}

/* Игровой экран */
#gameCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1;
}

/* HUD */
#gameHUD {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
}

.hud-top {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.world-name {
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 15px;
    border-radius: 10px;
    font-size: 1.1rem;
    backdrop-filter: blur(5px);
}

.player-pos {
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 15px;
    border-radius: 10px;
    font-family: monospace;
    backdrop-filter: blur(5px);
}

.fps-counter {
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 15px;
    border-radius: 10px;
    font-family: monospace;
    backdrop-filter: blur(5px);
}

.hud-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.crosshair {
    color: white;
    font-size: 2rem;
    opacity: 0.8;
    text-shadow: 0 0 5px black;
}

.hud-bottom {
    position: absolute;
    bottom: 120px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
}

.block-selector {
    display: flex;
    gap: 10px;
    background: rgba(0, 0, 0, 0.7);
    padding: 15px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    pointer-events: auto;
}

.block-slot {
    width: 70px;
    height: 85px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.block-slot.active {
    border-color: #00b4d8;
    background: rgba(0, 180, 216, 0.2);
    transform: scale(1.1);
}

.block-icon {
    font-size: 2rem;
    margin-bottom: 5px;
}

.block-name {
    font-size: 0.8rem;
    text-align: center;
    opacity: 0.9;
}

/* Мобильное управление */
#mobileControls {
    position: fixed;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;
}

/* Джойстик */
#joystickContainer {
    position: absolute;
    bottom: 150px;
    left: 40px;
    pointer-events: auto;
    touch-action: none;
}

#joystickBase {
    width: 110px;
    height: 110px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    position: absolute;
    backdrop-filter: blur(5px);
}

#joystickHandle {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    position: absolute;
    top: 25px;
    left: 25px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

/* Область камеры */
#cameraTouchArea {
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 70%;
    pointer-events: auto;
    touch-action: none;
}

/* Кнопки действий */
.action-buttons {
    position: absolute;
    bottom: 150px;
    right: 40px;
    pointer-events: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.action-btn {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    pointer-events: auto;
}

.action-btn:active {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(0.95);
}

/* Кнопка паузы */
.pause-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 1.5rem;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
}

/* Меню паузы */
.pause-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    padding: 30px;
    border-radius: 20px;
    width: 90%;
    max-width: 400px;
    z-index: 5;
    display: none;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.pause-menu h3 {
    text-align: center;
    margin-bottom: 30px;
    color: #90e0ef;
    font-size: 2rem;
}

.pause-menu-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 15px;
    width: 100%;
    margin-bottom: 15px;
    border-radius: 10px;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.pause-menu-btn:active {
    background: rgba(255, 255, 255, 0.2);
}

/* Экран загрузки */
#loadingScreen {
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-container {
    text-align: center;
}

.loading-spinner {
    width: 80px;
    height: 80px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top: 5px solid #00b4d8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 30px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #90e0ef;
}

.loading-progress {
    font-size: 1.2rem;
    font-family: monospace;
    color: white;
}

/* Адаптивность */
@media (max-width: 768px) {
    .game-title {
        font-size: 2.5rem;
    }
    
    .menu-btn {
        padding: 15px;
        font-size: 1.1rem;
    }
    
    .block-slot {
        width: 60px;
        height: 75px;
    }
    
    .block-icon {
        font-size: 1.5rem;
    }
    
    .action-btn {
        width: 70px;
        height: 70px;
        font-size: 1.5rem;
    }
    
    #joystickBase {
        width: 90px;
        height: 90px;
    }
    
    #joystickHandle {
        width: 50px;
        height: 50px;
        top: 20px;
        left: 20px;
    }
}

@media (max-width: 480px) {
    .game-title {
        font-size: 2rem;
    }
    
    .title-sub {
        font-size: 1rem;
    }
    
    .menu-btn {
        padding: 12px;
        font-size: 1rem;
    }
    
    .block-selector {
        padding: 10px;
        gap: 5px;
    }
    
    .block-slot {
        width: 50px;
        height: 65px;
    }
    
    .block-icon {
        font-size: 1.2rem;
    }
    
    .block-name {
        font-size: 0.7rem;
    }
    
    .action-buttons {
        bottom: 120px;
        right: 20px;
        gap: 15px;
    }
    
    .action-btn {
        width: 60px;
        height: 60px;
        font-size: 1.2rem;
    }
    
    #joystickContainer {
        bottom: 120px;
        left: 20px;
    }
}
