// src/systems/GameOverHandler.js
import { logger } from '../utils/LogManager';
import { debugOverlay } from '../debug/DebugOverlay';

export class GameOverHandler {
    constructor(scene) {
        this.scene = scene;
        this.isGameOver = false;
        this.moduleName = 'GameOverHandler';
        this.returnToMenuCallback = null;

        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        logger.info(this.moduleName, 'Initializing game over handler');
    }

    handleGameOver() {
        if (this.isGameOver) {
            logger.debug(this.moduleName, 'Game over sequence already in progress');
            return;
        }

        this.isGameOver = true;
        logger.info(this.moduleName, 'Game over sequence initiated');

        try {
            // Stop all game systems
            this.stopGameSystems();

            // Get final score before adding game over text
            const finalScore = this.scene.scoringSystem ? 
                this.scene.scoringSystem.getCurrentScore() : 0;

            logger.info(this.moduleName, 'Final score recorded', { finalScore });

            // Create overlay and UI elements
            this.createGameOverUI(finalScore);
        } catch (error) {
            logger.error(this.moduleName, 'Error during game over sequence', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    stopGameSystems() {
        try {
            // Pause the scene's physics
            this.scene.physics.pause();

            // Stop background scrolling
            if (this.scene.background) {
                this.scene.background.enabled = false;
            }

            // Stop obstacle updates
            if (this.scene.obstacleManager) {
                this.scene.obstacleManager.enabled = false;
                // Disable all active obstacles
                const activeObstacles = this.scene.obstacleManager.getActiveObstacles();
                activeObstacles.forEach(obstacle => {
                    if (obstacle.body) {
                        obstacle.body.setVelocity(0, 0);
                    }
                });
            }

            // Stop the difficulty manager
            if (this.scene.difficultyManager) {
                this.scene.difficultyManager.enabled = false;
            }

            // Freeze the scoring system
            if (this.scene.scoringSystem) {
                this.scene.scoringSystem.freeze();
            }

            // Stop player animations
            if (this.scene.player?.sprite?.sprite) {
                this.scene.player.sprite.sprite.anims.stop();
            }

            logger.info(this.moduleName, 'All game systems stopped');
        } catch (error) {
            logger.error(this.moduleName, 'Error stopping game systems', {
                error: error.message
            });
        }
    }

    createGameOverUI(finalScore) {
        try {
            // Create a semi-transparent overlay
            const overlay = this.scene.add.rectangle(
                0, 0,
                this.scene.cameras.main.width,
                this.scene.cameras.main.height,
                0x000000, 0.7
            );
            overlay.setOrigin(0, 0);
            overlay.setDepth(100);

            const gameOverText = this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 80,
                'Game Over',
                {
                    fontSize: '48px',
                    fill: '#fff',
                    fontFamily: 'Arial'
                }
            );
            gameOverText.setOrigin(0.5);
            gameOverText.setDepth(101);

            const scoreText = this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 20,
                `Final Score: ${finalScore}`,
                {
                    fontSize: '32px',
                    fill: '#fff',
                    fontFamily: 'Arial'
                }
            );
            scoreText.setOrigin(0.5);
            scoreText.setDepth(101);

            this.setupMenuButton();

            logger.debug(this.moduleName, 'Game over UI created');
        } catch (error) {
            logger.error(this.moduleName, 'Error creating game over UI', {
                error: error.message
            });
        }
    }

    setupMenuButton() {
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

        menuText.on('pointerover', () => menuText.setStyle({ fill: '#ffff00' }));
        menuText.on('pointerout', () => menuText.setStyle({ fill: '#ffffff' }));

        this.returnToMenuCallback = () => {
            logger.info(this.moduleName, 'Returning to menu');
            this.isGameOver = false;
            
            // Remove event listeners
            menuText.removeAllListeners();
            this.scene.input.keyboard.off('keydown-SPACE', this.returnToMenuCallback);
            
            // Start menu scene and stop current scene
            this.scene.scene.start('GameMenu');
            this.scene.scene.stop('GameScene');
        };

        menuText.on('pointerdown', this.returnToMenuCallback);
        this.scene.input.keyboard.once('keydown-SPACE', this.returnToMenuCallback);
    }

    reset() {
        this.isGameOver = false;
        if (this.returnToMenuCallback) {
            this.scene.input.keyboard.off('keydown-SPACE', this.returnToMenuCallback);
            this.returnToMenuCallback = null;
        }
        logger.info(this.moduleName, 'Game over handler reset');
    }
}