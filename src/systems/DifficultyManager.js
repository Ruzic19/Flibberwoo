// src/systems/DifficultyManager.js
import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { logger } from '../utils/LogManager';

export class DifficultyManager {
    constructor(scene, obstacleManager) {
        this.scene = scene;
        this.obstacleManager = obstacleManager;
        this.moduleName = 'DifficultyManager';
        this.difficultyLevel = 1;

        logger.enableModule(this.moduleName);
        logger.info(this.moduleName, 'Initializing difficulty manager', {
            initialLevel: this.difficultyLevel,
            updateInterval: OBSTACLE_CONFIG.DIFFICULTY.INTERVAL
        });

        this.setupDifficultyTimer();
    }

    setupDifficultyTimer() {
        try {
            this.difficultyTimer = this.scene.time.addEvent({
                delay: OBSTACLE_CONFIG.DIFFICULTY.INTERVAL,
                callback: this.increaseDifficulty,
                callbackScope: this,
                loop: true
            });

            logger.debug(this.moduleName, 'Difficulty timer configured', {
                delay: OBSTACLE_CONFIG.DIFFICULTY.INTERVAL,
                isLoop: true
            });
        } catch (error) {
            logger.error(this.moduleName, 'Failed to setup difficulty timer', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    increaseDifficulty() {
        const previousLevel = this.difficultyLevel;
        this.difficultyLevel++;
        
        logger.info(this.moduleName, 'Increasing difficulty', {
            previousLevel,
            newLevel: this.difficultyLevel,
            speedIncrement: OBSTACLE_CONFIG.DIFFICULTY.SPEED_INCREMENT,
            distanceDecrement: OBSTACLE_CONFIG.DIFFICULTY.DISTANCE_DECREMENT
        });
        
        try {
            this.obstacleManager.updateDifficulty(
                OBSTACLE_CONFIG.DIFFICULTY.SPEED_INCREMENT,
                OBSTACLE_CONFIG.DIFFICULTY.DISTANCE_DECREMENT
            );

            // Log milestone difficulties
            if (this.difficultyLevel % 5 === 0) {
                logger.info(this.moduleName, 'Difficulty milestone reached', {
                    level: this.difficultyLevel,
                    totalSpeedIncrease: OBSTACLE_CONFIG.DIFFICULTY.SPEED_INCREMENT * this.difficultyLevel,
                    totalDistanceDecrease: OBSTACLE_CONFIG.DIFFICULTY.DISTANCE_DECREMENT * this.difficultyLevel
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error while increasing difficulty', {
                error: error.message,
                currentLevel: this.difficultyLevel
            });
        }

        // Log warning if approaching maximum difficulty settings
        if (this.obstacleManager.spawner.currentSpeed >= OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED * 0.9) {
            logger.warn(this.moduleName, 'Approaching maximum speed limit', {
                currentSpeed: this.obstacleManager.spawner.currentSpeed,
                maxSpeed: OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED
            });
        }
    }

    reset() {
        const previousLevel = this.difficultyLevel;
        this.difficultyLevel = 1;
        
        logger.info(this.moduleName, 'Resetting difficulty manager', {
            previousLevel,
            newLevel: this.difficultyLevel
        });

        if (this.difficultyTimer) {
            this.difficultyTimer.destroy();
            logger.debug(this.moduleName, 'Previous difficulty timer destroyed');
        }

        this.setupDifficultyTimer();
    }

    getCurrentLevel() {
        return this.difficultyLevel;
    }
}