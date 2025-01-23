// src/scenes/game/GameSceneLoader.js
import { LAYER_INFO } from '../../config/layerConfig';
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';
import AssetLoader from '../../assets/AssetLoader';
import { logger } from '../../utils/LogManager';
import { debugOverlay } from '../../debug/DebugOverlay';

export class GameSceneLoader {
    constructor(scene) {
        this.scene = scene;
        this.moduleName = 'GameSceneLoader';
        this.assetsLoaded = {
            background: false,
            player: false,
            obstacles: false,
            ui: false
        };
        
        debugOverlay.setModuleDebug(this.moduleName, true);
        logger.info(this.moduleName, 'Initializing game scene loader');
    }

    loadAssets() {
        try {
            logger.info(this.moduleName, 'Starting asset loading process');
            
            this.setupLoadingConfiguration();
            this.setupLoadingListeners();
            
            // Load assets in sequence
            this.loadBackgroundLayers();
            this.loadPlayerAssets();
            this.loadObstacleAssets();
            this.loadUIAssets();
            
            logger.info(this.moduleName, 'Asset loading initiated');
        } catch (error) {
            logger.error(this.moduleName, 'Error initiating asset loading', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    loadUIAssets() {
        try {
            logger.info(this.moduleName, 'Loading UI assets');
            // Load UI icons
            this.scene.load.image('gear', 'assets/ui/gear.png');
            this.scene.load.image('home', 'assets/ui/home.png');
            this.scene.load.image('return', 'assets/ui/return.png');
            this.scene.load.image('musicOn', 'assets/ui/musicOn.png');
            this.scene.load.image('right', 'assets/ui/right.png');
            
            this.assetsLoaded.ui = true;
        } catch (error) {
            logger.error(this.moduleName, 'Error loading UI assets', {
                error: error.message
            });
        }
    }

    setupLoadingConfiguration() {
        try {
            this.scene.load.baseURL = '/';
            this.scene.load.crossOrigin = 'anonymous';
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Loading configuration set', {
                    baseURL: this.scene.load.baseURL,
                    crossOrigin: this.scene.load.crossOrigin
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error setting up loading configuration', {
                error: error.message
            });
        }
    }

    setupLoadingListeners() {
        try {
            this.scene.load.on('filecomplete', (key, type, data) => {
                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Asset loaded', {
                        key,
                        type,
                        dataSize: data ? data.length || 0 : 0
                    });
                }
            });

            this.scene.load.on('complete', () => {
                logger.info(this.moduleName, 'All assets loaded', {
                    status: this.assetsLoaded
                });
            });

            this.scene.load.on('loaderror', (file) => {
                logger.error(this.moduleName, 'Asset loading error', {
                    key: file.key,
                    type: file.type,
                    url: file.url
                });
            });
        } catch (error) {
            logger.error(this.moduleName, 'Error setting up loading listeners', {
                error: error.message
            });
        }
    }

    loadBackgroundLayers() {
        try {
            logger.info(this.moduleName, 'Loading background layers', {
                layerCount: LAYER_INFO.length
            });

            LAYER_INFO.forEach(layer => {
                const path = `assets/background/${layer.file}`;
                
                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Loading background layer', {
                        key: layer.key,
                        path
                    });
                }
                
                this.scene.load.image(layer.key, path);
            });

            this.assetsLoaded.background = true;
        } catch (error) {
            logger.error(this.moduleName, 'Error loading background layers', {
                error: error.message
            });
        }
    }

    loadPlayerAssets() {
        try {
            logger.info(this.moduleName, 'Loading player assets');
            
            AssetLoader.loadPlayerSprites(this.scene);
            this.assetsLoaded.player = true;
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Player assets load triggered');
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error loading player assets', {
                error: error.message
            });
        }
    }

    loadObstacleAssets() {
        try {
            logger.info(this.moduleName, 'Loading obstacle assets');
            
            Object.entries(OBSTACLE_CONFIG.TYPES).forEach(([key, value]) => {
                this.loadObstacleAsset(key, value);
            });

            this.assetsLoaded.obstacles = true;
        } catch (error) {
            logger.error(this.moduleName, 'Error in obstacle assets loading', {
                error: error.message
            });
        }
    }

    loadObstacleAsset(key, value) {
        try {
            if (key === 'BEE') {
                this.loadBeeObstacle(value);
            } else {
                this.loadStaticObstacle(value);
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error loading specific obstacle asset', {
                key,
                value,
                error: error.message
            });
        }
    }

    loadBeeObstacle(value) {
        const path = `assets/obstacles/${value}.png`;
        const config = OBSTACLE_CONFIG.ANIMATIONS.BEE;
        
        this.scene.load.spritesheet(value, path, {
            frameWidth: config.frameWidth,
            frameHeight: config.frameHeight
        });

        // Add specific completed handler for bee sprite sheet
        this.scene.load.on('filecomplete-spritesheet-' + value, (key, type, data) => {
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Bee sprite sheet loaded', {
                    dimensions: {
                        totalWidth: data.width,
                        totalHeight: data.height,
                        frameWidth: config.frameWidth,
                        frameHeight: config.frameHeight,
                        frames: Math.floor(data.width / config.frameWidth)
                    }
                });
            }
        });
    }

    loadStaticObstacle(value) {
        const path = `assets/obstacles/${value}.png`;
        
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Loading static obstacle', {
                value,
                path
            });
        }
        
        this.scene.load.image(value, path);
    }

    getLoadingStatus() {
        return {
            ...this.assetsLoaded,
            allComplete: Object.values(this.assetsLoaded).every(status => status)
        };
    }
}