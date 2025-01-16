// src/scenes/game/GameSceneComponents.js
import { GAME_CONFIG } from '../../config/gameConfig';
import { LAYER_INFO } from '../../config/layerConfig';
import Player from '../../entities/player/Player';
import ParallaxBackground from '../../systems/ParallaxBackground';
import { ObstacleManager } from '../../systems/ObstacleManager';
import { DifficultyManager } from '../../systems/DifficultyManager';
import { ScoringSystem } from '../../systems/ScoringSystem';  // Add this import

export class GameSceneComponents {
    constructor(scene) {
        this.scene = scene;
        this.debug = false;
        this.components = {
            background: null,
            player: null,
            obstacleManager: null,
            difficultyManager: null,
            scoringSystem: null  // Add this line
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
        this.createScoringSystem();  // Add this line

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

    createScoringSystem() {  // Add this method
        this.debugLog('Initializing scoring system');
        this.components.scoringSystem = new ScoringSystem(this.scene);
    }
}