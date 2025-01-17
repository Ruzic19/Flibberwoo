import { LAYER_INFO } from '../../config/layerConfig';
import { OBSTACLE_CONFIG } from '../../config/obstacleConfig';
import AssetLoader from '../../assets/AssetLoader';

export class GameSceneLoader {
    constructor(scene) {
        this.scene = scene;
        this.debug = false;
    }

    debugLog(message, data = null) {
        if (this.debug) {
            console.log(`[GameSceneLoader] ${message}`, data || '');
        }
    }

    loadAssets() {
        this.debugLog('Starting asset loading');
        this.scene.load.baseURL = '/';
        this.scene.load.crossOrigin = 'anonymous';
        
        this.loadBackgroundLayers();
        this.loadPlayerAssets();
        this.loadObstacleAssets();
    }

    loadBackgroundLayers() {
        this.debugLog('Loading background layers', LAYER_INFO);
        LAYER_INFO.forEach(layer => {
            const path = `assets/background/${layer.file}`;
            this.debugLog(`Loading image: ${layer.key} from ${path}`);
            this.scene.load.image(layer.key, path);
        });
    }

    loadPlayerAssets() {
        this.debugLog('Loading player assets');
        AssetLoader.loadPlayerSprites(this.scene);
    }

    loadObstacleAssets() {
        this.debugLog('Loading obstacle assets');
        Object.entries(OBSTACLE_CONFIG.TYPES).forEach(([key, value]) => {
            if (key === 'BEE') {
                // Load bee sprite sheet
                const path = `assets/obstacles/${value}.png`;
                this.debugLog(`Loading obstacle sprite sheet: ${value} from ${path}`);
                this.scene.load.spritesheet(value, path, {
                    frameWidth: OBSTACLE_CONFIG.ANIMATIONS.BEE.frameWidth,
                    frameHeight: OBSTACLE_CONFIG.ANIMATIONS.BEE.frameHeight
                });
                
                // Add debug logging for sprite sheet dimensions
                this.scene.load.on('filecomplete-spritesheet-' + value, (key, type, data) => {
                    console.log('Loaded bee sprite sheet dimensions:', {
                        totalWidth: data.width,
                        totalHeight: data.height,
                        frameWidth: OBSTACLE_CONFIG.ANIMATIONS.BEE.frameWidth,
                        frameHeight: OBSTACLE_CONFIG.ANIMATIONS.BEE.frameHeight,
                        possibleFrames: Math.floor(data.width / OBSTACLE_CONFIG.ANIMATIONS.BEE.frameWidth)
                    });
                });
            } else {
                // Load regular obstacle sprites
                const path = `assets/obstacles/${value}.png`;
                this.debugLog(`Loading obstacle: ${value} from ${path}`);
                this.scene.load.image(value, path);
            }
        });
    }  
}