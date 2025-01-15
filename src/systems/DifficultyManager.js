import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { GAME_CONFIG } from '../config/gameConfig';

export class DifficultyManager {
    constructor(scene, obstacleManager) {
        this.scene = scene;
        this.obstacleManager = obstacleManager;
        this.debug = true;
        this.difficultyLevel = 1;
        this.baseSpeed = 3;            // Starting background speed
        this.increment = 1;            // Speed increment
        this.speedMultiplier = 60;     // Reduced multiplier for better synchronization
        this.setupDifficultyTimer();
        
        // Set initial speeds
        this.updateSpeeds();
    }

    setupDifficultyTimer() {
        this.difficultyTimer = this.scene.time.addEvent({
            delay: 7000,  // 7 seconds
            callback: this.increaseDifficulty,
            callbackScope: this,
            loop: true
        });
    }

    increaseDifficulty() {
        this.difficultyLevel++;
        this.updateSpeeds();

        if (this.debug) {
            console.log(`[DifficultyManager] Level ${this.difficultyLevel}`);
            console.log(`[DifficultyManager] Background Speed: ${this.baseSpeed}`);
            console.log(`[DifficultyManager] Obstacle Speed: ${this.baseSpeed * this.speedMultiplier}`);
        }
    }

    updateSpeeds() {
        // Update base speed (background)
        this.baseSpeed = Math.min(
            3 + (this.increment * (this.difficultyLevel - 1)),
            20  // Max background speed
        );
        
        // Calculate synchronized obstacle speed
        const obstacleSpeed = this.baseSpeed * this.speedMultiplier;
        
        // Update obstacle manager with new speed
        if (this.obstacleManager) {
            this.obstacleManager.updateDifficulty(obstacleSpeed, 0);
        }
    }

    getCurrentSpeed() {
        return this.baseSpeed;
    }

    getObstacleSpeed() {
        return this.baseSpeed * this.speedMultiplier;
    }

    reset() {
        this.difficultyLevel = 1;
        this.baseSpeed = 3;
        if (this.difficultyTimer) {
            this.difficultyTimer.destroy();
        }
        this.setupDifficultyTimer();
        this.updateSpeeds();
    }
}