import { Obstacle } from '../entities/obstacles/Obstacle';

export class ObstaclePool {
    constructor(scene) {
        this.scene = scene;
        this.pools = {};
        this.debug = true;
    }

    initialize(types, poolSize) {
        types.forEach(type => {
            this.pools[type] = Array.from({ length: poolSize }, 
                () => new Obstacle(this.scene, type)
            );

            if (this.debug) {
                console.log(`[ObstaclePool] Created pool for type ${type} with size ${poolSize}`);
            }
        });
    }

    getInactiveObstacle(type) {
        const pool = this.pools[type];
        if (!pool) return null;
        
        const obstacle = pool.find(obstacle => !obstacle.isActive());
        
        if (this.debug && obstacle) {
            console.log(`[ObstaclePool] Retrieved inactive obstacle of type ${type}`);
        }
        
        return obstacle;
    }

    getAllActive() {
        const activeObstacles = Object.values(this.pools)
            .flat()
            .filter(obstacle => obstacle.isActive())
            .map(obstacle => obstacle.getSprite());
            
        if (this.debug) {
            console.log(`[ObstaclePool] Total active obstacles: ${activeObstacles.length}`);
        }
        
        return activeObstacles;
    }

    updateAll() {
        Object.values(this.pools)
            .flat()
            .forEach(obstacle => {
                if (obstacle.isActive()) {
                    obstacle.update();
                }
            });
    }
}