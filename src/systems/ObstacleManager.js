// src/systems/ObstacleManager.js
import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { ObstaclePool } from './ObstaclePool';
import { ObstacleSpawner } from './ObstacleSpawner';
import { logger } from '../utils/LogManager';
import { debugOverlay } from '../debug/DebugOverlay';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.moduleName = 'ObstacleManager';
        
        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        logger.debug(this.moduleName, 'Initializing obstacle system');
        
        this.pool = new ObstaclePool(scene);
        this.pool.initialize(
            Object.values(OBSTACLE_CONFIG.TYPES),
            OBSTACLE_CONFIG.POOL_SIZE
        );
        
        this.spawner = new ObstacleSpawner(scene, this.pool);
        
        logger.info(this.moduleName, 'Obstacle system initialized', {
            poolSize: OBSTACLE_CONFIG.POOL_SIZE,
            obstacleTypes: Object.values(OBSTACLE_CONFIG.TYPES)
        });
    }

    updateDifficulty(speedIncrement, distanceDecrement) {
        const oldSpeed = this.spawner.currentSpeed;
        const oldMinSpacing = OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN;
        const oldMaxSpacing = OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX;

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

        logger.debug(this.moduleName, 'Difficulty updated', {
            speedChange: {
                old: oldSpeed,
                new: this.spawner.currentSpeed,
                increment: speedIncrement
            },
            spacingChange: {
                min: {
                    old: oldMinSpacing,
                    new: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN
                },
                max: {
                    old: oldMaxSpacing,
                    new: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX
                },
                decrement: distanceDecrement
            }
        });

        // Log warning if approaching minimum spacing
        if (OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN <= 150) {
            logger.warn(this.moduleName, 'Group spacing approaching minimum safe distance', {
                currentMin: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN
            });
        }
    }

    update() {
        try {
            this.pool.updateAll();
            this.spawner.spawn();
        } catch (error) {
            logger.error(this.moduleName, 'Error during update cycle', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    getActiveObstacles() {
        const activeObstacles = this.pool.getAllActive();
        
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Retrieved active obstacles', {
                count: activeObstacles.length,
                positions: activeObstacles.map(obstacle => ({
                    x: obstacle.x,
                    y: obstacle.y
                }))
            });
        }
        
        return activeObstacles;
    }
}