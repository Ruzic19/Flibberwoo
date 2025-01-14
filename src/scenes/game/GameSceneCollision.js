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
        // Early returns if collision checking is disabled or required objects are missing
        if (!this.checkingCollisions || !this.player || !this.obstacleManager) return;
    
        const playerSprite = this.player.sprite.sprite;
        if (!playerSprite || !playerSprite.active || !playerSprite.body) return;
    
        const playerBody = playerSprite.body;
        const obstacles = this.obstacleManager.getActiveObstacles();
        
        if (!obstacles) return;
        
        let collisionDetected = false;
        
        obstacles.forEach(obstacle => {
            if (!obstacle || !obstacle.active || !obstacle.body) return;
            
            const obstacleBody = obstacle.body;
            
            // Get the actual physics bodies bounds
            const playerBounds = {
                left: playerBody.x,
                right: playerBody.x + playerBody.width,
                top: playerBody.y,
                bottom: playerBody.y + playerBody.height
            };
            
            const obstacleBounds = {
                left: obstacleBody.x,
                right: obstacleBody.x + obstacleBody.width,
                top: obstacleBody.y,
                bottom: obstacleBody.y + obstacleBody.height
            };
            
            // Check for actual physics body overlap
            if (!(playerBounds.right < obstacleBounds.left || 
                  playerBounds.left > obstacleBounds.right || 
                  playerBounds.bottom < obstacleBounds.top || 
                  playerBounds.top > obstacleBounds.bottom)) {
                
                if (this.debug) {
                    console.log('[GameSceneCollision] Collision detected between:', {
                        player: playerBounds,
                        obstacle: obstacleBounds
                    });
                }
                
                collisionDetected = true;
            }
        });
        
        if (collisionDetected) {
            this.handleCollision();
        }
    }

    handleCollision() {
        if (!this.checkingCollisions) return;
        this.checkingCollisions = false;
        
        this.debugLog('Processing collision');
        
        // Stop all animations
        if (this.player && this.player.sprite) {
            this.player.sprite.sprite.anims.stop();
        }
        
        // Stop all obstacle animations and movement
        if (this.obstacleManager) {
            const obstacles = this.obstacleManager.getActiveObstacles();
            obstacles.forEach(obstacle => {
                if (obstacle.anims) obstacle.anims.stop();
            });
        }
        
        // Stop background parallax
        if (this.scene.background) {
            this.scene.background.enabled = false;
        }
        
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