// src/scenes/game/GameSceneCollision.js
import { GameOverHandler } from '../../systems/GameOverHandler';

export class GameSceneCollision {
    constructor(scene) {
        this.scene = scene;
        this.debug = true;
        this.gameOverHandler = new GameOverHandler(scene);
        this.checkingCollisions = false;
        this.debugGraphics = null;
        this.player = null;
        this.obstacleManager = null;
    }

    debugLog(message, data = null) {
        if (this.debug) {
            console.log(`[GameSceneCollision] ${message}`, data || '');
        }
    }

    setupCollision(player, obstacleManager) {
        this.debugLog('Setting up collision detection');
        this.player = player;
        this.obstacleManager = obstacleManager;
        this.checkingCollisions = true;

        // Enable debug rendering of physics bodies
        if (this.debug) {
            this.debugGraphics = this.scene.add.graphics();
            this.debugGraphics.setDepth(1000);
            
            // Store update event callback so we can remove it later
            this.updateDebugGraphics = () => {
                if (!this.debugGraphics || !this.player || !this.obstacleManager) return;
                
                this.debugGraphics.clear();
                this.debugGraphics.lineStyle(1, 0xff0000);
                
                // Draw player hitbox if it exists
                const playerSprite = this.player.sprite.sprite;
                if (playerSprite && playerSprite.body) {
                    this.debugGraphics.strokeRect(
                        playerSprite.body.x, 
                        playerSprite.body.y, 
                        playerSprite.body.width, 
                        playerSprite.body.height
                    );
                }
                
                // Draw obstacle hitboxes
                const obstacles = this.obstacleManager.getActiveObstacles();
                if (obstacles) {
                    obstacles.forEach(obstacle => {
                        if (obstacle.body && obstacle.active) {
                            this.debugGraphics.strokeRect(
                                obstacle.body.x,
                                obstacle.body.y,
                                obstacle.body.width,
                                obstacle.body.height
                            );
                        }
                    });
                }
            };
            
            this.scene.events.on('update', this.updateDebugGraphics);
        }
    }

    update() {
        if (!this.checkingCollisions || !this.player || !this.obstacleManager) return;

        const playerSprite = this.player.sprite.sprite;
        if (!playerSprite || !playerSprite.active) return;

        const playerBounds = playerSprite.getBounds();
        const obstacles = this.obstacleManager.getActiveObstacles();
        
        if (!obstacles) return;
        
        obstacles.forEach(obstacle => {
            if (!obstacle || !obstacle.active) return;
            
            const obstacleBounds = obstacle.getBounds();
            
            if (Phaser.Geom.Rectangle.Overlaps(playerBounds, obstacleBounds)) {
                this.debugLog('Collision detected between:', {
                    player: {
                        x: playerSprite.x,
                        y: playerSprite.y,
                        bounds: playerBounds
                    },
                    obstacle: {
                        x: obstacle.x,
                        y: obstacle.y,
                        bounds: obstacleBounds
                    }
                });
                
                this.handleCollision();
            }
        });
    }

    handleCollision() {
        if (!this.checkingCollisions) return;
        this.checkingCollisions = false;
        
        this.debugLog('Processing collision');
        
        // Add screen shake effect
        this.scene.cameras.main.shake(200, 0.01);
        
        // Trigger game over sequence
        this.gameOverHandler.handleGameOver();
    }

    cleanup() {
        this.debugLog('Cleaning up collision system');
        
        // Remove debug graphics
        if (this.debugGraphics) {
            this.debugGraphics.destroy();
            this.debugGraphics = null;
        }

        // Remove event listeners
        if (this.updateDebugGraphics) {
            this.scene.events.off('update', this.updateDebugGraphics);
            this.updateDebugGraphics = null;
        }

        // Clear references
        this.player = null;
        this.obstacleManager = null;
        this.checkingCollisions = false;
    }

    reset() {
        this.gameOverHandler.reset();
        this.checkingCollisions = true;
    }
}