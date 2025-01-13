// src/main.js
import Phaser from "phaser";
import GameMenu from "./scenes/GameMenu";
import GameScene from "./scenes/GameScene";

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
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: false,
            debugBodyColor: 0xff00ff,
            debugStaticBodyColor: 0xff00ff
        }
    }
};

const game = new Phaser.Game(config);

window.onerror = function(msg, src, lineNo, colNo, error) {
    console.error('Game Error:', { msg, src, lineNo, colNo, error });
    return false;
};