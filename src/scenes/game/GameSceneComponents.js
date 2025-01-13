import { GAME_CONFIG } from '../../config/gameConfig';
import { LAYER_INFO } from '../../config/layerConfig';
import Player from '../../entities/player/Player';
import ParallaxBackground from '../../systems/ParallaxBackground';
import { ObstacleManager } from '../../systems/ObstacleManager';
import { DifficultyManager } from '../../systems/DifficultyManager';

export class GameSceneComponents {
    constructor(scene) {
        this.scene = scene;
        this.debug = false;
        this.components = {
            background: null,
            player: null,
            obstacleManager: null,
            difficultyManager: null
        };
    }

    debugLog(message, data = null) {
        if (this.debug) {
            console.log(`[GameSceneComponents] ${message}`, data || '');
        }
    }

    createComponents() {
        this.debugLog('Creating game components');
        
        this.createBackground();
        this.createPlayer();
        this.createObstacleSystem();
        this.createDifficultyManager();

        return this.components;
    }

    createBackground() {
        this.debugLog('Creating ParallaxBackground');
        this.components.background = new ParallaxBackground(this.scene, LAYER_INFO);
    }

    createPlayer() {
        const playerX = this.scene.cameras.main.width * GAME_CONFIG.PLAYER.INITIAL_POSITION.X_RATIO;
        const playerY = this.scene.cameras.main.height * GAME_CONFIG.PLAYER.INITIAL_POSITION.Y_RATIO;
        this.components.player = new Player(this.scene, playerX, playerY);
    }

    createObstacleSystem() {
        this.debugLog('Initializing obstacle system');
        this.components.obstacleManager = new ObstacleManager(this.scene);
    }

    createDifficultyManager() {
        this.debugLog('Initializing difficulty manager');
        this.components.difficultyManager = new DifficultyManager(
            this.scene, 
            this.components.obstacleManager
        );
    }
}