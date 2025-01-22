// src/scenes/game/GameScene.js
import { GameSceneLoader } from './GameSceneLoader';
import { GameSceneCollision } from './GameSceneCollision';
import { GameSceneComponents } from './GameSceneComponents';
import { logger } from '../../utils/LogManager';
import { debugOverlay } from '../../debug/DebugOverlay';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.moduleName = 'GameScene';
        this.loader = new GameSceneLoader(this);
        this.collision = new GameSceneCollision(this);
        this.componentManager = new GameSceneComponents(this);
        this.isShuttingDown = false;
        
        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        logger.info(this.moduleName, 'Game scene initialized');
    }

    preload() {
        logger.info(this.moduleName, 'Starting preload phase');
        
        try {
            this.loader.loadAssets();
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Asset loading triggered');
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error during preload', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    create() {
        try {
            logger.info(this.moduleName, 'Starting scene creation');
            this.isShuttingDown = false;
            
            // Create all game components
            const components = this.componentManager.createComponents();
            
            // Store component references
            this.initializeComponents(components);
            
            // Setup collision detection
            this.setupCollision();
            
            logger.info(this.moduleName, 'Scene creation complete', {
                componentsInitialized: {
                    background: !!this.background,
                    player: !!this.player,
                    obstacleManager: !!this.obstacleManager,
                    difficultyManager: !!this.difficultyManager,
                    scoringSystem: !!this.scoringSystem
                }
            });
        } catch (error) {
            logger.error(this.moduleName, 'Error during scene creation', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    initializeComponents(components) {
        this.background = components.background;
        this.player = components.player;
        this.obstacleManager = components.obstacleManager;
        this.difficultyManager = components.difficultyManager;
        this.scoringSystem = components.scoringSystem;
        this.collision = components.collision || new GameSceneCollision(this);
        
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Components initialized', {
                componentStatus: {
                    background: !!this.background,
                    player: !!this.player,
                    obstacleManager: !!this.obstacleManager,
                    difficultyManager: !!this.difficultyManager,
                    scoringSystem: !!this.scoringSystem,
                    collision: !!this.collision
                }
            });
        }
    }

    setupCollision() {
        if (!this.player || !this.obstacleManager) {
            logger.error(this.moduleName, 'Required components missing for collision setup', {
                playerExists: !!this.player,
                obstacleManagerExists: !!this.obstacleManager
            });
            return;
        }

        try {
            this.collision.setupCollision(this.player, this.obstacleManager);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Collision system configured');
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error setting up collision system', {
                error: error.message
            });
        }
    }

    update() {
        if (this.isShuttingDown) {
            return;
        }

        try {
            this.updateBackground();
            this.updateGameComponents();
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                this.logUpdateStatus();
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error during update cycle', {
                error: error.message,
                componentStatus: this.getComponentStatus()
            });
        }
    }

    updateBackground() {
        if (this.background) {
            this.background.update();
            
            // Sync obstacle speed with background if needed
            if (this.obstacleManager && this.background.getLayer1PixelsPerFrame) {
                this.syncObstacleSpeed();
            }
        }
    }

    syncObstacleSpeed() {
        try {
            const layer1Speed = this.background.getLayer1PixelsPerFrame();
            // Convert pixels per frame to pixels per second (assuming 60 FPS)
            const pixelsPerSecond = layer1Speed * 60;
            // Scale the speed appropriately
            const targetSpeed = pixelsPerSecond * 10;
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Syncing speeds', {
                    layer1Speed,
                    pixelsPerSecond,
                    targetSpeed
                });
            }
            
            if (this.obstacleManager.spawner) {
                this.obstacleManager.spawner.updateSpeed(targetSpeed);
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error syncing obstacle speed', {
                error: error.message
            });
        }
    }

    updateGameComponents() {
        if (this.player) {
            this.player.update();
        }
        if (this.obstacleManager) {
            this.obstacleManager.update();
        }
        if (this.collision) {
            this.collision.update();
        }
        if (this.scoringSystem) {
            this.scoringSystem.update();
        }
    }

    logUpdateStatus() {
        logger.debug(this.moduleName, 'Update cycle completed', {
            componentStatus: this.getComponentStatus()
        });
    }

    getComponentStatus() {
        return {
            background: {
                exists: !!this.background,
                enabled: this.background?.enabled
            },
            player: {
                exists: !!this.player,
                position: this.player?.sprite?.sprite ? 
                    { x: this.player.sprite.sprite.x, y: this.player.sprite.sprite.y } : null,
                active: this.player?.sprite?.sprite?.active || false
            },
            obstacleManager: {
                exists: !!this.obstacleManager,
                activeObstacles: this.obstacleManager?.getActiveObstacles()?.length || 0
            },
            scoringSystem: {
                exists: !!this.scoringSystem,
                currentScore: this.scoringSystem?.getCurrentScore()
            }
        };
    }

    cleanup() {
        if (this.isShuttingDown) return;
        
        try {
            logger.info(this.moduleName, 'Starting scene cleanup');
            this.isShuttingDown = true;
            
            // Cleanup collision system first
            if (this.collision) {
                this.collision.cleanup();
                this.collision = null;
            }

            // Remove event listeners
            this.events.off('update');
            this.events.off('shutdown');

            // Clear game objects
            this.clearGameObjects();
            
            logger.info(this.moduleName, 'Scene cleanup complete');
        } catch (error) {
            logger.error(this.moduleName, 'Error during scene cleanup', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    clearGameObjects() {
        const previousState = this.getComponentStatus();
        
        this.background = null;
        this.player = null;
        this.obstacleManager = null;
        this.difficultyManager = null;
        this.scoringSystem = null;
        
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Game objects cleared', {
                previousState
            });
        }
    }
}