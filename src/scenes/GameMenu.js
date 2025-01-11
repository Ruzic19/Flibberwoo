export default class GameMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'GameMenu' });
    }

    debug(message, data = null) {
        console.log(`[GameMenu] ${message}`, data || '');
    }

    create() {
        this.debug('Creating game menu');
        
        // Get the center coordinates of the game
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.debug('Screen center:', { x: centerX, y: centerY });

        // Add title text
        const titleText = this.add.text(centerX, centerY - 100, 'Flibberwoo', {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        this.debug('Added title text');

        // Create start button with background
        const buttonWidth = 200;
        const buttonHeight = 60;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY - buttonHeight / 2;

        // Add button background
        const buttonBackground = this.add.rectangle(
            centerX,
            centerY,
            buttonWidth,
            buttonHeight,
            0x4a4a4a
        ).setInteractive();

        // Add button text
        const startButton = this.add.text(centerX, centerY, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial, sans-serif'
        })
        .setOrigin(0.5)
        .setInteractive();

        this.debug('Added start button');

        // Button hover effects
        buttonBackground.on('pointerover', () => {
            buttonBackground.setFillStyle(0x666666);
            startButton.setStyle({ fill: '#ff0' });
        });

        buttonBackground.on('pointerout', () => {
            buttonBackground.setFillStyle(0x4a4a4a);
            startButton.setStyle({ fill: '#fff' });
        });

        // Click handlers
        const startGame = () => {
            this.debug('Starting game scene');
            this.scene.start('GameScene');
        };

        buttonBackground.on('pointerdown', startGame);
        startButton.on('pointerdown', startGame);
    }
}