// src/scenes/game/GameSceneCollision.js
import { GameOverHandler } from '../../systems/GameOverHandler';
import { logger } from '../../utils/LogManager';
import { debugOverlay } from '../../debug/DebugOverlay';

export class GameSceneCollision {
    constructor(scene) {
        this.scene = scene;
        this.moduleName = 'GameSceneCollision';
        this.debugGraphics = null;
        this.player = null;
        this.obstacleManager = null;
        this.gameOverHandler = new GameOverHandler(scene);
        this.checkingCollisions = false;

        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        logger.info(this.moduleName, 'Initializing collision system');
        
        // Added new property to control which elements show debug visuals
        this.debugElements = {
            player: false,
            obstacles: true
        };
    }

    debugLog(message, data = null) {
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, message, data);
        }
    }

    setupCollision(player, obstacleManager) {
        logger.debug(this.moduleName, 'Setting up collision detection');
        this.player = player;
        this.obstacleManager = obstacleManager;
        this.checkingCollisions = true;

        // Setup debug graphics
        this.setupDebugGraphics();
    }

    setupDebugGraphics() {
        // Clear any existing debug graphics first
        this.clearDebugGraphics();

        // Always create debug graphics but only show when debug is enabled
        this.debugGraphics = this.scene.add.graphics();
        this.debugGraphics.setDepth(1000);
        
        // Store update event callback so we can remove it later
        this.updateDebugGraphics = () => {
            if (!this.debugGraphics || !this.player || !this.obstacleManager) return;
            
            // Clear previous frame's graphics
            this.debugGraphics.clear();
            
            // Only draw if debug is enabled
            if (!debugOverlay.isDebugEnabled(this.moduleName)) {
                return;
            }
            
            this.debugGraphics.lineStyle(1, 0xff0000);
            
            // Draw player hitbox if it exists and debugging is enabled
            const playerSprite = this.player.sprite.sprite;
            if (this.debugElements.player && playerSprite && playerSprite.body) {
                this.debugGraphics.strokeRect(
                    playerSprite.body.x, 
                    playerSprite.body.y, 
                    playerSprite.body.width, 
                    playerSprite.body.height
                );
            }
            
            // Draw obstacle hitboxes
            if (this.debugElements.obstacles) {
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
            }
        };
        
        this.scene.events.on('update', this.updateDebugGraphics);
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
                
                this.debugLog('Collision detected between:', {
                    player: playerBounds,
                    obstacle: obstacleBounds
                });
                
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

        // Immediately freeze the scoring system
        if (this.scene.scoringSystem) {
            this.scene.scoringSystem.freeze();
        }
        
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

    clearDebugGraphics() {
        if (this.debugGraphics) {
            this.debugGraphics.clear();
            this.debugGraphics.destroy();
            this.debugGraphics = null;
        }

        if (this.updateDebugGraphics) {
            this.scene.events.off('update', this.updateDebugGraphics);
            this.updateDebugGraphics = null;
        }
    }

    cleanup() {
        logger.debug(this.moduleName, 'Cleaning up collision system');
        
        // Clear debug graphics
        this.clearDebugGraphics();

        // Clear references
        this.player = null;
        this.obstacleManager = null;
        this.checkingCollisions = false;
    }

    reset() {
        this.gameOverHandler.reset();
        this.checkingCollisions = true;
        // Refresh debug graphics setup
        this.setupDebugGraphics();
    }
}