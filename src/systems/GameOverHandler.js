// src/systems/GameOverHandler.js
export class GameOverHandler {
    constructor(scene) {
        this.scene = scene;
        this.isGameOver = false;
        this.debug = true;
        this.returnToMenuCallback = null;
    }

    handleGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // Pause the scene's physics and timers
        this.scene.physics.pause();
        this.scene.time.paused = true;

        if (this.debug) {
            console.log('[GameOverHandler] Game over sequence initiated');
        }

        // Create a semi-transparent overlay
        const overlay = this.scene.add.rectangle(
            0, 0,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x000000, 0.7
        );
        overlay.setOrigin(0, 0);
        overlay.setDepth(100);

        // Add "Game Over" text
        const gameOverText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 50,
            'Game Over',
            {
                fontSize: '48px',
                fill: '#fff',
                fontFamily: 'Arial'
            }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(101);

        // Add "Return to Menu" text that acts as a button
        const menuText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 50,
            'Return to Menu',
            {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial'
            }
        );
        menuText.setOrigin(0.5);
        menuText.setDepth(101);
        menuText.setInteractive({ useHandCursor: true });

        // Add hover effect
        menuText.on('pointerover', () => {
            menuText.setStyle({ fill: '#ffff00' });
        });

        menuText.on('pointerout', () => {
            menuText.setStyle({ fill: '#ffffff' });
        });

        // Handle click/tap
        this.returnToMenuCallback = () => {
            if (this.debug) {
                console.log('[GameOverHandler] Returning to menu');
            }
            this.isGameOver = false;
            
            // Remove event listeners
            menuText.removeAllListeners();
            this.scene.input.keyboard.off('keydown-SPACE', this.returnToMenuCallback);
            
            // Resume physics and timers before changing scenes
            this.scene.physics.resume();
            this.scene.time.paused = false;
            
            // Start menu scene and then stop current scene
            this.scene.scene.start('GameMenu');
            this.scene.scene.stop('GameScene');
        };

        menuText.on('pointerdown', this.returnToMenuCallback);

        // Add keyboard handler for quick restart
        this.scene.input.keyboard.once('keydown-SPACE', this.returnToMenuCallback);
    }

    reset() {
        this.isGameOver = false;
        if (this.returnToMenuCallback) {
            this.scene.input.keyboard.off('keydown-SPACE', this.returnToMenuCallback);
            this.returnToMenuCallback = null;
        }
    }
}