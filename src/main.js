// src/main.js
import Phaser from "phaser";
import GameMenu from "./scenes/GameMenu";
import GameScene from "./scenes/game/GameScene";
import { setGlobalDebug, setModuleDebug, DEBUG_CONFIG } from './config/debugConfig';
import { logger } from './utils/LogManager';

// Configure debug settings
if (process.env.NODE_ENV === 'development') {
    // Default debug settings for development
    setModuleDebug('ParallaxBackground', false);
    setModuleDebug('ObstacleManager', true);
    setModuleDebug('ObstaclePool', true);
    setModuleDebug('ObstacleSpawner', true);
    setModuleDebug('GameOverHandler', true);
    setModuleDebug('DifficultyManager', true);
    setModuleDebug('ScoringSystem', true);
    setModuleDebug('GameScene', true);
    setModuleDebug('GameSceneCollision', true);
} else {
    // Disable all debugging in production
    setGlobalDebug(false);
}

// Game configuration
const config = {
    type: Phaser.CANVAS,
    width: 928,
    height: 450,
    parent: 'game',
    backgroundColor: '#000000',
    scene: [GameMenu, GameScene],
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 928,
        height: 450
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: DEBUG_CONFIG.MODULES.GameScene,
        }
    }
};

// Initialize game
const game = new Phaser.Game(config);

// Helper function to clear debug graphics for a scene
function clearDebugGraphics(scene) {
    if (scene.physics.world.debugGraphic) {
        scene.physics.world.debugGraphic.clear();
    }
}

// Helper function to update scene debug state
function updateSceneDebug(scene, enabled) {
    if (scene.physics && scene.physics.world) {
        // Clear existing debug graphics first
        clearDebugGraphics(scene);
        
        // Update debug settings
        scene.physics.world.debugGraphic.visible = enabled;
        scene.physics.world.drawDebug = enabled;

        // Force refresh of debug graphics
        if (enabled) {
            scene.physics.world.drawDebug = false;
            scene.physics.world.drawDebug = true;
        }
    }
}

// Error handling
window.onerror = function(msg, src, lineNo, colNo, error) {
    logger.error('Game', 'Global error caught', {
        message: msg,
        source: src,
        line: lineNo,
        column: colNo,
        error: error?.stack
    });
    return false;
};

// Create debug control panel
function createDebugControls() {
    if (process.env.NODE_ENV === 'development') {
        const debugPanel = document.createElement('div');
        debugPanel.style.position = 'fixed';
        debugPanel.style.top = '10px';
        debugPanel.style.right = '10px';
        debugPanel.style.backgroundColor = 'rgba(0,0,0,0.7)';
        debugPanel.style.padding = '10px';
        debugPanel.style.color = 'white';
        debugPanel.style.zIndex = '1000';
        debugPanel.style.maxHeight = '80vh';
        debugPanel.style.overflowY = 'auto';
        debugPanel.style.borderRadius = '5px';
        debugPanel.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" id="globalDebug"> Global Debug
                </label>
                <button id="togglePanel" style="margin-bottom: 10px; padding: 5px 10px;">Hide Panel</button>
            </div>
            <div id="moduleToggles"></div>
        `;

        document.body.appendChild(debugPanel);

        // Add global debug toggle
        const globalToggle = document.getElementById('globalDebug');
        globalToggle.checked = DEBUG_CONFIG.GLOBAL;
        globalToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setGlobalDebug(enabled);
            updateModuleToggles();
            
            // Update all active scenes
            game.scene.scenes.forEach(scene => {
                updateSceneDebug(scene, enabled);
            });
        });

        // Add toggle panel button
        const togglePanel = document.getElementById('togglePanel');
        const moduleToggles = document.getElementById('moduleToggles');
        let isPanelVisible = true;
        togglePanel.addEventListener('click', () => {
            isPanelVisible = !isPanelVisible;
            moduleToggles.style.display = isPanelVisible ? 'block' : 'none';
            togglePanel.textContent = isPanelVisible ? 'Hide Panel' : 'Show Panel';
            debugPanel.style.backgroundColor = isPanelVisible ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)';
        });

        // Function to update module toggles
        function updateModuleToggles() {
            const checkboxes = moduleToggles.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = DEBUG_CONFIG.GLOBAL || DEBUG_CONFIG.MODULES[checkbox.dataset.module];
            });
        }

        // Add individual module toggles
        Object.keys(DEBUG_CONFIG.MODULES).forEach(moduleName => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.cursor = 'pointer';
            label.innerHTML = `
                <input type="checkbox" data-module="${moduleName}"> ${moduleName}
            `;
            moduleToggles.appendChild(label);

            const checkbox = label.querySelector('input');
            checkbox.checked = DEBUG_CONFIG.MODULES[moduleName];
            checkbox.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                setModuleDebug(moduleName, enabled);
                
                // Update physics debug if GameScene toggle changes
                if (moduleName === 'GameScene') {
                    game.scene.scenes.forEach(scene => {
                        updateSceneDebug(scene, enabled);
                    });
                }

                // If this module has a cleanup method, call it
                game.scene.scenes.forEach(scene => {
                    if (scene[moduleName.toLowerCase()] && typeof scene[moduleName.toLowerCase()].setupDebugGraphics === 'function') {
                        scene[moduleName.toLowerCase()].setupDebugGraphics();
                    }
                });
            });
        });

        // Add keyboard shortcut to toggle panel visibility
        document.addEventListener('keydown', (e) => {
            if (e.key === '`') {  // backtick key
                togglePanel.click();
            }
        });

        logger.info('Game', 'Debug controls initialized');
    }
}

// Initialize debug controls
createDebugControls();