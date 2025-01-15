// src/scenes/game/GameScene.js
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
        this.isShuttingDown = false;
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
        try {
            this.debugLog('Create function started');
            this.isShuttingDown = false;
            
            // Create all game components
            const components = this.componentManager.createComponents();
    
            // Store components on the scene for access
            this.background = components.background;
            this.player = components.player;
            this.obstacleManager = components.obstacleManager;
            this.difficultyManager = components.difficultyManager;
    
            // Double chec difficulty manager was created
            if (!this.difficultyManager) {
                throw new Error('Difficulty Manager failed to initialize');
            }
        
            // Ensure collision component exists
            this.collision = components.collision || new GameSceneCollision(this);
            
            // Setup collision detection
            if (this.player && this.obstacleManager) {
                this.collision.setupCollision(this.player, this.obstacleManager);
            } else {
                this.debugLog('Error: Player or ObstacleManager not initialized');
            }

            this.debugLog('Scene creation complete', {
                background: !!this.background,
                player: !!this.player,
                obstacleManager: !!this.obstacleManager,
                difficultyManager: !!this.difficultyManager
            });

        } catch (error) {
            console.error("[GameScene] Error in create:", error);
        }
    }

    update() {
        if (this.isShuttingDown) return;
        try {
            if (this.background) {
                this.background.update();
            }
            if (this.player) {
                this.player.update();
            }
            if (this.obstacleManager) {
                this.obstacleManager.update();
            }
            if (this.collision) {
                this.collision.update();
            }
        } catch (error) {
            console.error('[GameScene] Error in update:', error);
        }
    }

    cleanup() {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        
        this.debugLog('Cleaning up GameScene');
        
        // Cleanup collision system first
        if (this.collision) {
            this.collision.cleanup();
            this.collision = null;
        }

        // Remove event listeners
        this.events.off('update');
        this.events.off('shutdown');

        // Clear game objects
        this.background = null;
        this.player = null;
        this.obstacleManager = null;
        this.difficultyManager = null;
    }
}