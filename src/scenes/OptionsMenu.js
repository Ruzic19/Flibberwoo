import { logger } from '../utils/LogManager';
import { debugOverlay } from '../debug/DebugOverlay';

export default class OptionsMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsMenu' });
    }

    create() {
        // Semi-transparent background
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.7
        );
        overlay.setOrigin(0, 0);
        overlay.setDepth(100);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Title
        const title = this.add.text(centerX, centerY - 150, 'Options', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Volume control
        const volumeContainer = this.add.container(centerX - 100, centerY - 60);

        const musicIcon = this.add.image(-50, 0, 'musicOn')  // Moved icon left
            .setScale(0.5)
            .setOrigin(0.5);

         // Slider background - moved right and adjusted width
        const sliderBg = this.add.rectangle(150, 0, 200, 8, 0x666666);
        const sliderKnob = this.add.circle(150, 0, 12, 0xffffff)
            .setInteractive({ draggable: true });

        // Slider logic
        let volume = 1;
        sliderKnob.on('drag', (pointer, dragX) => {
            const boundedX = Phaser.Math.Clamp(dragX, sliderBg.x - 100, sliderBg.x + 100);
            sliderKnob.x = boundedX;
            volume = (boundedX - (sliderBg.x - 100)) / 200;
        });

        volumeContainer.add([musicIcon, sliderBg, sliderKnob]);

        // Create buttons with icons
        const buttonSpacing = 80;
        const buttonY = centerY + 50;
        
         // Resume button
        const resumeButton = this.createIconButton(centerX - buttonSpacing * 1.5, buttonY, 'right', 'Resume', () => {
            this.resumeGame();
        });

       // Restart button
        const restartButton = this.createIconButton(centerX, buttonY, 'return', 'Restart', () => {
            this.restartGame();
        }, true); // Add flag to prevent icon change

        // Home button
        const homeButton = this.createIconButton(centerX + buttonSpacing * 1.5, buttonY, 'home', 'Home', () => {
            this.returnToMainMenu();
        });

        // Pause the game scene
        if (this.scene.get('GameScene').scene.isPaused()) {
            this.scene.get('GameScene').scene.resume();
        }
        this.scene.get('GameScene').scene.pause();
    }

    createIconButton(x, y, iconKey, text, callback) {
        const container = this.add.container(x, y);
        
        const icon = this.add.image(0, -20, iconKey)
            .setScale(0.5);
            
        const button = this.add.text(0, 20, text, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        container.add([icon, button]);
        container.setSize(50, 80);
        container.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                button.setStyle({ fill: '#ffff00' });
                icon.setTint(0xffff00);
            })
            .on('pointerout', () => {
                button.setStyle({ fill: '#ffffff' });
                icon.clearTint();
            })
            .on('pointerdown', callback);

        return container;
    }

    resumeGame() {
        this.scene.get('GameScene').scene.resume();
        this.scene.stop();
    }

    restartGame() {
        this.scene.get('GameScene').scene.restart();
        this.scene.stop();
    }

    returnToMainMenu() {
        this.scene.get('GameScene').scene.stop();
        this.scene.start('GameMenu');
        this.scene.stop();
    }

    preload() {
        this.load.image('gear', 'assets/ui/gear.png');
        this.load.image('home', 'assets/ui/home.png');
        this.load.image('return', 'assets/ui/return.png');
        this.load.image('musicOn', 'assets/ui/musicOn.png');
        this.load.image('right', 'assets/ui/right.png');
    }
}