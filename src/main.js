// src/main.js
import Phaser from "phaser";
import GameMenu from "./scenes/GameMenu";
import GameScene from "./scenes/game/GameScene";
import { debugOverlay } from './debug/DebugOverlay';
import { logger } from './utils/LogManager';

// Configure debug settings
if (process.env.NODE_ENV === 'development') {
    // Default debug settings for development
    debugOverlay.setModuleDebug('ParallaxBackground', false);
    debugOverlay.setModuleDebug('ObstacleManager', true);
    debugOverlay.setModuleDebug('ObstaclePool', true);
    debugOverlay.setModuleDebug('ObstacleSpawner', true);
    debugOverlay.setModuleDebug('GameOverHandler', true);
    debugOverlay.setModuleDebug('DifficultyManager', true);
    debugOverlay.setModuleDebug('ScoringSystem', true);
    debugOverlay.setModuleDebug('GameScene', true);
    debugOverlay.setModuleDebug('GameSceneCollision', true);
} else {
    // Disable all debugging in production
    debugOverlay.setGlobalDebug(false);
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
            debug: debugOverlay.isDebugEnabled('GameScene'),
        }
    }
};

// Initialize game
const game = new Phaser.Game(config);

// Initialize debug overlay
debugOverlay.initialize(game);

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