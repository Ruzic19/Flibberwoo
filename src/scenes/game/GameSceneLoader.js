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
            const path = `assets/obstacles/${value}.png`;
            this.debugLog(`Loading obstacle: ${value} from ${path}`);
            this.scene.load.image(value, path);
        });
    }
}