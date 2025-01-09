import Phaser from "phaser";
import GameMenu from "./scenes/GameMenu"

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: '#000000',
    scene: [GameMenu],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

new Phaser.Game(config);
