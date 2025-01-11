import { GAME_CONFIG } from '../config/gameConfig';
import { LAYER_INFO } from '../config/layerConfig';
import Player from '../entities/Player';
import ParallaxBackground from '../systems/ParallaxBackground';
import AssetLoader from '../assets/AssetLoader';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    debug(message, data = null) {
        console.log(`[GameScene] ${message}`, data || '');
    }

    init() {
        this.debug('Scene initialized');
    }

    checkAssetPaths() {
        this.debug('Checking asset paths:');
        LAYER_INFO.forEach(layer => {
            const path = `assets/background/${layer.file}`;
            // Log the complete URL that will be used
            const fullPath = this.load.baseURL + path;
            this.debug(`Full asset path for ${layer.key}: ${fullPath}`);
        });
    }

    preload() {
        this.debug('Starting preload');
        this.load.baseURL = '/';
        this.load.crossOrigin = 'anonymous';
        
        this.checkAssetPaths();

        // Load background layers
        this.debug('Loading background layers', LAYER_INFO);
        LAYER_INFO.forEach(layer => {
            const path = `assets/background/${layer.file}`;
            this.debug(`Loading image: ${layer.key} from ${path}`);
            this.load.image(layer.key, path);
        });

        // Load player assets
        AssetLoader.loadPlayerSprites(this);
    }

    create() {
        this.debug('Create function started');
        
        // Verify loaded textures
        this.debug('Available textures:', Object.keys(this.textures.list));
        
        // Create background
        this.debug('Creating ParallaxBackground');
        this.background = new ParallaxBackground(this, LAYER_INFO);
        
        // Create player animations
        AssetLoader.createPlayerAnimations(this);

        // Create player
        const playerX = this.cameras.main.width * GAME_CONFIG.PLAYER.INITIAL_POSITION.X_RATIO;
        const playerY = this.cameras.main.height * GAME_CONFIG.PLAYER.INITIAL_POSITION.Y_RATIO;
        this.player = new Player(this, playerX, playerY);
    }

    update() {
        this.background.update();
        this.player.update();
    }
}
