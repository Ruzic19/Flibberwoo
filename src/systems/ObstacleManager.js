import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { ObstaclePool } from './ObstaclePool';
import { ObstacleSpawner } from './ObstacleSpawner';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.debug = true;
        
        this.pool = new ObstaclePool(scene);
        this.pool.initialize(
            Object.values(OBSTACLE_CONFIG.TYPES),
            OBSTACLE_CONFIG.POOL_SIZE
        );
        
        this.spawner = new ObstacleSpawner(scene, this.pool);
        
        // Initial speed setup
        this.currentSpeed = 300; // Initial obstacle speed (100 * background speed of 3)
        this.spawner.updateSpeed(this.currentSpeed);
        
        if (this.debug) {
            console.log('[ObstacleManager] Initial speed:', this.currentSpeed);
        }
    }

    updateDifficulty(newSpeed, distanceDecrement) {
        if (this.debug) {
            console.log('[ObstacleManager] Updating speed to:', newSpeed);
        }

        this.currentSpeed = newSpeed;
        this.spawner.updateSpeed(this.currentSpeed);
    }

    update() {
        this.pool.updateAll();
        this.spawner.spawn();
    }

    getActiveObstacles() {
        return this.pool.getAllActive();
    }

    getCurrentSpeed() {
        return this.currentSpeed;
    }
}