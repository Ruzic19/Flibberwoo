import { Obstacle } from '../entities/obstacles/Obstacle';

export class ObstaclePool {
    constructor(scene) {
        this.scene = scene;
        this.pools = {};
        this.debug = false;
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
        return this.pools[type]?.find(obstacle => !obstacle.isActive());
    }

    getAllActive() {
        return Object.values(this.pools)
            .flat()
            .filter(obstacle => obstacle.isActive())
            .map(obstacle => obstacle.getSprite());
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