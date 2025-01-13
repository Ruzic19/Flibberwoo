import { GameSceneLoader } from './GameSceneLoader';
import { GameSceneCollision } from './GameSceneCollision';
import { GameSceneComponents } from './GameSceneComponents';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.debugMode = true;
        this.loader = new GameSceneLoader(this);
        this.collision = new GameSceneCollision(this);
        this.componentManager = new GameSceneComponents(this);
    }

    debugLog(message, data = null) {
        if (this.debugMode) {
            console.log(`[GameScene] ${message}`, data || '');
        }
    }

    preload() {
        this.debugLog('Starting preload');
        this.loader.loadAssets();
    }

    create() {
        this.debugLog('Create function started');
        
        // Reset any existing debug graphics
        if (this.physics.world.debugGraphic) {
            this.physics.world.debugGraphic.clear();
        }
        
        // Create all game components
        const components = this.componentManager.createComponents();
        this.background = components.background;
        this.player = components.player;
        this.obstacleManager = components.obstacleManager;
        this.difficultyManager = components.difficultyManager;

        // Setup collision detection
        this.collision.setupCollision(this.player, this.obstacleManager);

        // Cleanup and position debug graphics properly
        if (this.physics.world.debugGraphic) {
            this.physics.world.debugGraphic.setDepth(1000);
            this.physics.world.debugGraphic.setPosition(0, 0);
        }
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