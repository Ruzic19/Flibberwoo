import Phaser from "phaser";
import GameMenu from "./scene/GameMenu"

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

// function preload() {
//     this.load.image('logo', );
// }

// function create() {
//     const logo = this.add.image(400, 300, 'logo');
//     this.tweens.add({
//         targets: logo,
//         y: 850,
//         duration: 2000,
//         ease: 'Power2',
//         yoyo: true,
//         loop: -1,
//     });
//}
