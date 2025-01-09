import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
    },
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('logo', );
}

function create() {
    const logo = this.add.image(400, 300, 'logo');
    this.tweens.add({
        targets: logo,
        y: 850,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1,
    });
}
