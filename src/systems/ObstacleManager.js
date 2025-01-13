import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { ObstaclePool } from './ObstaclePool';
import { ObstacleSpawner } from './ObstacleSpawner';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.debug = false;
        
        this.pool = new ObstaclePool(scene);
        this.pool.initialize(
            Object.values(OBSTACLE_CONFIG.TYPES),
            OBSTACLE_CONFIG.POOL_SIZE
        );
        
        this.spawner = new ObstacleSpawner(scene, this.pool);
        
        if (this.debug) {
            console.log('[ObstacleManager] Initializing obstacle system');
        }
    }

    updateDifficulty(speedIncrement, distanceDecrement) {
        this.spawner.updateSpeed(
            this.spawner.currentSpeed + speedIncrement
        );
        
        OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN = Math.max(
            OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN - distanceDecrement,
            100
        );
        OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX = Math.max(
            OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX - distanceDecrement,
            200
        );

        if (this.debug) {
            console.log('[ObstacleManager] Difficulty updated', {
                newSpeed: this.spawner.currentSpeed,
                newGroupSpacingMin: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN,
                newGroupSpacingMax: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX
            });
        }
    }

    update() {
        this.pool.updateAll();
        this.spawner.spawn();
    }

    getActiveObstacles() {
        return this.pool.getAllActive();
    }
}