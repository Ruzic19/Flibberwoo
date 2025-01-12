// src/main.js
import Phaser from "phaser";
import GameMenu from "./scenes/GameMenu";
import GameScene from "./scenes/GameScene";

const config = {
    type: Phaser.CANVAS,  // Using CANVAS renderer for better pixel art rendering
    width: 928,
    height: 450,
    parent: 'game',
    backgroundColor: '#000000',
    scene: [GameMenu, GameScene],
    render: {
        pixelArt: true,  // Enable pixel art mode globally
        antialias: false,  // Disable antialiasing
        roundPixels: true  // Round pixel positions to prevent subpixel rendering
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
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

window.onerror = function(msg, src, lineNo, colNo, error) {
    console.error('Game Error:', { msg, src, lineNo, colNo, error });
    return false;
};