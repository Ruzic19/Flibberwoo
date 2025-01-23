// src/scenes/game/GameSceneComponents.js
import { GAME_CONFIG } from '../../config/gameConfig';
import { LAYER_INFO } from '../../config/layerConfig';
import Player from '../../entities/player/Player';
import ParallaxBackground from '../../systems/ParallaxBackground';
import { ObstacleManager } from '../../systems/ObstacleManager';
import { DifficultyManager } from '../../systems/DifficultyManager';
import { ScoringSystem } from '../../systems/ScoringSystem';
import { logger } from '../../utils/LogManager';
import { debugOverlay } from '../../debug/DebugOverlay';

export class GameSceneComponents {
    constructor(scene) {
        this.scene = scene;
        this.moduleName = 'GameSceneComponents';
        this.components = {
            background: null,
            player: null,
            obstacleManager: null,
            difficultyManager: null,
            scoringSystem: null,
            optionsButton: null
        };
        
        debugOverlay.setModuleDebug(this.moduleName, true);
        logger.info(this.moduleName, 'Initializing game scene components manager');
    }

    createComponents() {
        try {
            logger.info(this.moduleName, 'Starting component creation');
            
            this.createBackground();
            this.createPlayer();
            this.createObstacleSystem();
            this.createDifficultyManager();
            this.createScoringSystem();
            this.components.optionsButton = this.createOptionsButton();
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Components created', {
                    status: this.getComponentStatus()
                });
            }
            
            return this.components;
        } catch (error) {
            logger.error(this.moduleName, 'Error during component creation', {
                error: error.message,
                stack: error.stack,
                componentStatus: this.getComponentStatus()
            });
            throw error;
        }
    }

    createOptionsButton() {
        logger.info(this.moduleName, 'Creating options button');
        
        const optionsButton = this.scene.add.image(40, 40, 'gear')
            .setScrollFactor(0)
            .setDepth(1000)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true });
    
        optionsButton.on('pointerover', () => {
            optionsButton.setTint(0xffff00);
            logger.debug(this.moduleName, 'Options button hover');
        });
        
        optionsButton.on('pointerout', () => {
            optionsButton.clearTint();
        });
    
        optionsButton.on('pointerdown', () => {
            logger.info(this.moduleName, 'Options button clicked');
            this.scene.scene.launch('OptionsMenu');
        });
    
        logger.info(this.moduleName, 'Options button created', {
            position: { x: optionsButton.x, y: optionsButton.y },
            scale: optionsButton.scale,
            depth: optionsButton.depth
        });
    
        return optionsButton;
    }

    createBackground() {
        try {
            logger.info(this.moduleName, 'Creating ParallaxBackground');
            this.components.background = new ParallaxBackground(this.scene, LAYER_INFO);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Background created', {
                    layerCount: LAYER_INFO.length
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error creating background', {
                error: error.message,
                layerInfo: LAYER_INFO
            });
        }
    }

    createPlayer() {
        try {
            const playerX = this.scene.cameras.main.width * GAME_CONFIG.PLAYER.INITIAL_POSITION.X_RATIO;
            const playerY = this.scene.cameras.main.height * GAME_CONFIG.PLAYER.INITIAL_POSITION.Y_RATIO;
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Creating player', {
                    position: { x: playerX, y: playerY },
                    config: GAME_CONFIG.PLAYER
                });
            }
            
            this.components.player = new Player(this.scene, playerX, playerY);
            
            logger.info(this.moduleName, 'Player created');
        } catch (error) {
            logger.error(this.moduleName, 'Error creating player', {
                error: error.message,
                config: GAME_CONFIG.PLAYER
            });
        }
    }

    createObstacleSystem() {
        try {
            logger.info(this.moduleName, 'Creating obstacle management system');
            
            this.components.obstacleManager = new ObstacleManager(this.scene);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Obstacle system created', {
                    activeObstacles: this.components.obstacleManager.getActiveObstacles()?.length || 0
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error creating obstacle system', {
                error: error.message
            });
        }
    }

    createDifficultyManager() {
        try {
            if (!this.components.obstacleManager) {
                throw new Error('Obstacle manager must be created before difficulty manager');
            }
            
            logger.info(this.moduleName, 'Creating difficulty manager');
            
            this.components.difficultyManager = new DifficultyManager(
                this.scene,
                this.components.obstacleManager
            );
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Difficulty manager created');
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error creating difficulty manager', {
                error: error.message,
                hasObstacleManager: !!this.components.obstacleManager
            });
        }
    }

    createScoringSystem() {
        try {
            logger.info(this.moduleName, 'Creating scoring system');
            
            this.components.scoringSystem = new ScoringSystem(this.scene);
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Scoring system created');
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error creating scoring system', {
                error: error.message
            });
        }
    }

    getComponentStatus() {
        return {
            background: {
                exists: !!this.components.background,
                layerCount: LAYER_INFO.length
            },
            player: {
                exists: !!this.components.player,
                config: {
                    scale: GAME_CONFIG.PLAYER.SCALE,
                    initialPosition: GAME_CONFIG.PLAYER.INITIAL_POSITION
                }
            },
            obstacleManager: {
                exists: !!this.components.obstacleManager,
                activeObstacles: this.components.obstacleManager?.getActiveObstacles()?.length || 0
            },
            difficultyManager: {
                exists: !!this.components.difficultyManager
            },
            scoringSystem: {
                exists: !!this.components.scoringSystem,
                currentScore: this.components.scoringSystem?.getCurrentScore() || 0
            }
        };
    }

    cleanup() {
        try {
            const previousStatus = this.getComponentStatus();
            
            // Clear all component references
            Object.keys(this.components).forEach(key => {
                if (this.components[key]?.cleanup) {
                    this.components[key].cleanup();
                }
                this.components[key] = null;
            });
            
            logger.info(this.moduleName, 'Components cleaned up', {
                previousStatus
            });
        } catch (error) {
            logger.error(this.moduleName, 'Error during component cleanup', {
                error: error.message,
                componentStatus: this.getComponentStatus()
            });
        }
    }
}