import ParallaxBackground from '../systems/ParallaxBackground';
import { LAYER_INFO } from '../config/layerConfig';

export default class GameMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'GameMenu' });
    }

    preload() {
        // Load all background layers
        this.load.baseURL = '/';
        this.load.crossOrigin = 'anonymous';
        
        LAYER_INFO.forEach(layer => {
            const path = `assets/background/${layer.file}`;
            this.load.image(layer.key, path);
        });
    }

    create() {
        // Create background first
        this.background = new ParallaxBackground(this, LAYER_INFO);
        
        // Get the center coordinates
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Create a semi-transparent overlay (matching game over style)
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.4
        );
        overlay.setOrigin(0, 0);
        overlay.setDepth(100);

        // Add title text
        const titleText = this.add.text(
            centerX,
            centerY - 50,
            'Flibberwoo',
            {
                fontSize: '48px',
                fill: '#fff',
                fontFamily: 'Arial'
            }
        );
        titleText.setOrigin(0.5);
        titleText.setDepth(101);

        // Add start game text/button
        const startButton = this.add.text(
            centerX,
            centerY + 50,
            'Start Game',
            {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial'
            }
        );
        startButton.setOrigin(0.5);
        startButton.setDepth(101);
        startButton.setInteractive({ useHandCursor: true });

        // Add hover effects
        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#ffff00' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#ffffff' });
        });

        // Start game on click
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }

    update() {
        if (this.background) {
            this.background.update();
        }
    }
}