import Phaser from 'phaser';

export default class GameMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'GameMenu' });
    }

    create() {
        // Get the center coordinates of the game
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Add title text
        this.add.text(centerX, centerY - 100, 'Flibberwoo', {
            fontSize: '48px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Create start button
        const startButton = this.add.text(centerX, centerY, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#4a4a4a',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => startButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => startButton.setStyle({ fill: '#fff' }))
        .on('pointerdown', () => {
            console.log('Starting GameScene');
            this.scene.start('GameScene');
        });
    }
}