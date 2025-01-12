import { GAME_CONFIG } from '../config/gameConfig';
import { LAYER_INFO } from '../config/layerConfig';
import Player from '../entities/player/Player';
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

    preload() {
        this.debug('Starting preload');
        this.load.baseURL = '/';
        this.load.crossOrigin = 'anonymous';
        
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
        
        // Create background
        this.debug('Creating ParallaxBackground');
        this.background = new ParallaxBackground(this, LAYER_INFO);

        // Create player
        const playerX = this.cameras.main.width * GAME_CONFIG.PLAYER.INITIAL_POSITION.X_RATIO;
        const playerY = this.cameras.main.height * GAME_CONFIG.PLAYER.INITIAL_POSITION.Y_RATIO;
        this.player = new Player(this, playerX, playerY);
    }

    update() {
        if (this.background) {
            this.background.update();
        }
        if (this.player) {
            this.player.update();
        }
    }
}