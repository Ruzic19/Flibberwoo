// src/main.js
import Phaser from "phaser";
import GameMenu from "./scenes/GameMenu";
import GameScene from "./scenes/game/GameScene";
import { setGlobalDebug, setModuleDebug, DEBUG_CONFIG } from './config/debugConfig';
import { logger } from './utils/LogManager';
import { DebugOverlay } from './debug/DebugOverlay';

// Configure debug settings
if (process.env.NODE_ENV === 'development') {
    // Default debug settings for development
    setModuleDebug('ParallaxBackground', false);
    setModuleDebug('ObstacleManager', false);
    setModuleDebug('ObstaclePool', false);
    setModuleDebug('ObstacleSpawner', false);
    setModuleDebug('GameOverHandler', false);
    setModuleDebug('DifficultyManager', false);
    setModuleDebug('ScoringSystem', false);
    setModuleDebug('GameScene', true);
    setModuleDebug('GameSceneCollision', false);
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

// Initialize debug overlay
const debugOverlay = new DebugOverlay(game);
debugOverlay.initialize();