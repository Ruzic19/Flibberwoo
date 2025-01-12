import { GAME_CONFIG } from '../config/gameConfig.js';
import { LAYER_INFO } from '../config/layerConfig.js';  // Add this import
import Player from '../entities/player/Player.js';
import ParallaxBackground from '../systems/ParallaxBackground.js';
import AssetLoader from '../assets/AssetLoader.js';
import { ObstacleManager } from '../systems/ObstacleManager.js';
import { DifficultyManager } from '../systems/DifficultyManager.js';
import { OBSTACLE_CONFIG } from '../config/obstacleConfig.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    debug(message, data = null) {
        console.log(`[GameScene] ${message}`, data || '');
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

        // Load obstacle assets
        this.debug('Loading obstacle assets');
        Object.entries(OBSTACLE_CONFIG.TYPES).forEach(([key, value]) => {
            const path = `assets/obstacles/${value}.png`;
            this.debug(`Loading obstacle: ${value} from ${path}`);
            this.load.image(value, path);
        });
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

        // Initialize obstacle system
        this.debug('Initializing obstacle system');
        this.obstacleManager = new ObstacleManager(this);
        this.obstacleManager.debug = true; // Enable debug logging

        this.debug('Initializing difficulty manager');
        this.difficultyManager = new DifficultyManager(this, this.obstacleManager);
        this.difficultyManager.debug = true; // Enable debug logging

        // Setup collision detection
        this.debug('Setting up collision detection');
        this.physics.add.collider(
            this.player.sprite.sprite,
            this.obstacleManager.getActiveObstacles(),
            this.handleCollision,
            null,
            this
        );
    }

    handleCollision(playerSprite, obstacleSprite) {
        this.debug('Collision detected between player and obstacle');
        this.scene.restart();
    }

    update() {
        if (this.background) {
            this.background.update();
        }
        if (this.player) {
            this.player.update();
        }
        if (this.obstacleManager) {
            this.obstacleManager.update();
        }
    }
}