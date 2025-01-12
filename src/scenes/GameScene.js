import { GAME_CONFIG } from '../config/gameConfig.js';
import { LAYER_INFO } from '../config/layerConfig.js';
import Player from '../entities/player/Player.js';
import ParallaxBackground from '../systems/ParallaxBackground.js';
import AssetLoader from '../assets/AssetLoader.js';
import { ObstacleManager } from '../systems/ObstacleManager.js';
import { DifficultyManager } from '../systems/DifficultyManager.js';
import { OBSTACLE_CONFIG } from '../config/obstacleConfig.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.debugMode = true;
    }

    debugLog(message, data = null) {
        if (this.debugMode) {
            console.log(`[GameScene] ${message}`, data || '');
        }
    }

    preload() {
        this.debugLog('Starting preload');
        this.load.baseURL = '/';
        this.load.crossOrigin = 'anonymous';
        
        // Load background layers
        this.debugLog('Loading background layers', LAYER_INFO);
        LAYER_INFO.forEach(layer => {
            const path = `assets/background/${layer.file}`;
            this.debugLog(`Loading image: ${layer.key} from ${path}`);
            this.load.image(layer.key, path);
        });

        // Load player assets
        AssetLoader.loadPlayerSprites(this);

        // Load obstacle assets
        this.debugLog('Loading obstacle assets');
        Object.entries(OBSTACLE_CONFIG.TYPES).forEach(([key, value]) => {
            const path = `assets/obstacles/${value}.png`;
            this.debugLog(`Loading obstacle: ${value} from ${path}`);
            this.load.image(value, path);
        });
    }

    create() {
        this.debugLog('Create function started');
        
        // Reset any existing debug graphics
        if (this.physics.world.debugGraphic) {
            this.physics.world.debugGraphic.clear();
        }
        
        // Create background
        this.debugLog('Creating ParallaxBackground');
        this.background = new ParallaxBackground(this, LAYER_INFO);

        // Create player
        const playerX = this.cameras.main.width * GAME_CONFIG.PLAYER.INITIAL_POSITION.X_RATIO;
        const playerY = this.cameras.main.height * GAME_CONFIG.PLAYER.INITIAL_POSITION.Y_RATIO;
        this.player = new Player(this, playerX, playerY);

        // Initialize obstacle system
        this.debugLog('Initializing obstacle system');
        this.obstacleManager = new ObstacleManager(this);
        
        this.debugLog('Initializing difficulty manager');
        this.difficultyManager = new DifficultyManager(this, this.obstacleManager);

        // Setup collision detection
        this.setupCollision();

        // Cleanup and position debug graphics properly
        if (this.physics.world.debugGraphic) {
            this.physics.world.debugGraphic.setDepth(1000); // Ensure it's above everything
            this.physics.world.debugGraphic.setPosition(0, 0); // Reset position
        }
    }

    setupCollision() {
        this.debugLog('Setting up collision detection');
        
        // Create collider without debug visualization
        const collider = this.physics.add.collider(
            this.player.sprite.sprite,
            this.obstacleManager.getActiveObstacles(),
            this.handleCollision,
            this.checkCollision,
            this
        );

        // Disable debug for this specific collider
        if (collider.showDebug) {
            collider.showDebug = false;
        }
    }

    checkCollision(playerSprite, obstacleSprite) {
        const playerBody = playerSprite.body;
        const obstacleBody = obstacleSprite.body;

        const collision = Phaser.Geom.Rectangle.Overlaps(
            playerBody.getBounds(),
            obstacleBody.getBounds()
        );

        if (collision) {
            const overlap = Phaser.Geom.Rectangle.Overlap(
                playerBody.getBounds(),
                obstacleBody.getBounds()
            );

            const overlapThreshold = 0.2;
            const overlapPercent = overlap / (playerBody.width * playerBody.height);
            
            return overlapPercent > overlapThreshold;
        }

        return false;
    }

    handleCollision(playerSprite, obstacleSprite) {
        this.cameras.main.shake(200, 0.01);
        
        this.time.delayedCall(300, () => {
            this.scene.restart();
        });
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