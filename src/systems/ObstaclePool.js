// src/systems/ObstaclePool.js
import { Obstacle } from '../entities/obstacles/Obstacle';
import { logger } from '../utils/LogManager';
import { debugOverlay } from '../debug/DebugOverlay';

export class ObstaclePool {
    constructor(scene) {
        this.scene = scene;
        this.pools = {};
        this.moduleName = 'ObstaclePool';
        
        debugOverlay.setModuleDebug(this.moduleName, true);
        logger.info(this.moduleName, 'Initializing obstacle pool');
    }

    initialize(types, poolSize) {
        logger.debug(this.moduleName, 'Creating obstacle pools', {
            types,
            poolSize
        });

        types.forEach(type => {
            this.pools[type] = Array.from({ length: poolSize }, 
                () => new Obstacle(this.scene, type)
            );

            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Created pool', {
                    type,
                    size: poolSize,
                    activeCount: this.pools[type].filter(o => o.isActive()).length
                });
            }
        });
    }

    getInactiveObstacle(type) {
        const pool = this.pools[type];
        if (!pool) {
            logger.warn(this.moduleName, 'Pool not found for type', { type });
            return null;
        }
        
        const obstacle = pool.find(obstacle => !obstacle.isActive());
        
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            if (obstacle) {
                logger.debug(this.moduleName, 'Retrieved inactive obstacle', {
                    type,
                    poolSize: pool.length,
                    remainingInactive: pool.filter(o => !o.isActive()).length
                });
            } else {
                logger.warn(this.moduleName, 'No inactive obstacles available', {
                    type,
                    poolSize: pool.length,
                    allActive: pool.every(o => o.isActive())
                });
            }
        }
        
        return obstacle;
    }

    getAllActive() {
        const activeObstacles = Object.values(this.pools)
            .flat()
            .filter(obstacle => obstacle.isActive())
            .map(obstacle => obstacle.getSprite());
            
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Retrieved active obstacles', {
                count: activeObstacles.length,
                byType: Object.entries(this.pools).reduce((acc, [type, pool]) => {
                    acc[type] = pool.filter(o => o.isActive()).length;
                    return acc;
                }, {})
            });
        }
        
        return activeObstacles;
    }

    updateAll() {
        try {
            Object.entries(this.pools).forEach(([type, obstacles]) => {
                const activeCount = obstacles.filter(o => o.isActive()).length;
                if (activeCount > 0 && debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Updating obstacles', {
                        type,
                        activeCount
                    });
                }

                obstacles.forEach(obstacle => {
                    if (obstacle.isActive()) {
                        obstacle.update();
                    }
                });
            });
        } catch (error) {
            logger.error(this.moduleName, 'Error updating obstacles', {
                error: error.message,
                stack: error.stack
            });
        }
    }
}