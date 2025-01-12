import { OBSTACLE_CONFIG } from '../config/obstacleConfig';

export class DifficultyManager {
    constructor(scene, obstacleManager) {
        this.scene = scene;
        this.obstacleManager = obstacleManager;
        this.debug = false; // Set to true to see debug info
        this.difficultyLevel = 1;
        this.setupDifficultyTimer();
    }

    setupDifficultyTimer() {
        this.difficultyTimer = this.scene.time.addEvent({
            delay: OBSTACLE_CONFIG.DIFFICULTY.INTERVAL,
            callback: this.increaseDifficulty,
            callbackScope: this,
            loop: true
        });
    }

    increaseDifficulty() {
        this.difficultyLevel++;
        
        this.obstacleManager.updateDifficulty(
            OBSTACLE_CONFIG.DIFFICULTY.SPEED_INCREMENT,
            OBSTACLE_CONFIG.DIFFICULTY.DISTANCE_DECREMENT
        );

        if (this.debug) {
            console.log(`Difficulty increased to level ${this.difficultyLevel}`);
        }
    }

    reset() {
        this.difficultyLevel = 1;
        if (this.difficultyTimer) {
            this.difficultyTimer.destroy();
        }
        this.setupDifficultyTimer();
    }
}