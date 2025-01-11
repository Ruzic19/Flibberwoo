import Phaser from "phaser";
import GameMenu from "./scenes/GameMenu";
import GameScene from "./scenes/GameScene";

const config = {
    type: Phaser.AUTO,
    width: 928,  // Match the background image width
    height: 450, // Reduced height to remove the black space
    parent: 'game',
    backgroundColor: '#000000',
    scene: [GameMenu, GameScene],  // Make sure GameMenu is first
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

new Phaser.Game(config);