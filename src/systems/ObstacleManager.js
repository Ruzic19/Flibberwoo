import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { Obstacle } from '../entities/obstacles/Obstacle';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.debug = true; // Enable debug by default
        
        this.obstacles = {
            [OBSTACLE_CONFIG.TYPES.SMALL]: [],
            [OBSTACLE_CONFIG.TYPES.MEDIUM]: [],
            [OBSTACLE_CONFIG.TYPES.LARGE]: []
        };
        
        this.nextSpawnTime = 0;
        this.currentSpeed = OBSTACLE_CONFIG.SPAWN.BASE_SPEED;
        this.currentMinDistance = OBSTACLE_CONFIG.SPAWN.MIN_DISTANCE;
        this.currentMaxDistance = OBSTACLE_CONFIG.SPAWN.MAX_DISTANCE; // Now using config value
        
        this.debugLog('Initializing obstacle manager');
        this.initializePool();
    }

    debugLog(message, data = null) {
        if (this.debug) {
            console.log(`[ObstacleManager] ${message}`, data || '');
        }
    }

    initializePool() {
        Object.entries(this.obstacles).forEach(([type, pool]) => {
            this.debugLog(`Creating pool for obstacle type: ${type}`);
            for (let i = 0; i < OBSTACLE_CONFIG.POOL_SIZE; i++) {
                pool.push(new Obstacle(this.scene, type));
                this.debugLog(`Created obstacle ${i + 1} of type ${type}`);
            }
        });
    }

    getInactiveObstacle(type) {
        const obstacle = this.obstacles[type].find(obs => !obs.isActive());
        this.debugLog(`Finding inactive obstacle of type ${type}`, obstacle ? 'Found' : 'Not found');
        return obstacle;
    }

    getRandomDistance() {
        // Generate a random distance between currentMinDistance and currentMaxDistance
        return Math.random() * (this.currentMaxDistance - this.currentMinDistance) + this.currentMinDistance;
    }

    spawnObstacle() {
        const currentTime = this.scene.time.now;
        
        if (currentTime < this.nextSpawnTime) {
            return;
        }

        this.debugLog('Attempting to spawn obstacle');

        // Randomly select obstacle type
        const types = Object.values(OBSTACLE_CONFIG.TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        this.debugLog(`Selected obstacle type: ${randomType}`);
        
        const obstacle = this.getInactiveObstacle(randomType);
        if (!obstacle) {
            this.debugLog('No inactive obstacles available');
            return;
        }

        // Spawn position
        const x = this.scene.cameras.main.width + 100;
        const y = this.scene.cameras.main.height * 
            OBSTACLE_CONFIG.SPAWN.Y_POSITION[this.getTypeName(randomType)];
        
        this.debugLog(`Spawning obstacle at position`, { x, y, speed: this.currentSpeed });
        
        // Enable the obstacle
        obstacle.enable(x, y, this.currentSpeed);
        
        // Set next spawn time with random distance
        const randomDistance = this.getRandomDistance();
        this.nextSpawnTime = currentTime + randomDistance;
        
        this.debugLog('Next spawn scheduled at', { 
            distance: randomDistance,
            minDistance: this.currentMinDistance,
            maxDistance: this.currentMaxDistance
        });
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }

    updateDifficulty(speedIncrement, distanceDecrement) {
        this.currentSpeed = Math.min(
            this.currentSpeed + speedIncrement,
            OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED
        );
        
        // Update both min and max distances
        this.currentMinDistance = Math.max(
            this.currentMinDistance - distanceDecrement,
            OBSTACLE_CONFIG.DIFFICULTY.MIN_SPAWN_DISTANCE
        );
        
        this.currentMaxDistance = Math.max(
            this.currentMaxDistance - distanceDecrement,
            OBSTACLE_CONFIG.DIFFICULTY.MAX_SPAWN_DISTANCE // Now using config value
        );

        this.debugLog('Difficulty updated', {
            newSpeed: this.currentSpeed,
            newMinDistance: this.currentMinDistance,
            newMaxDistance: this.currentMaxDistance
        });
    }

    update() {
        // Update all active obstacles
        Object.values(this.obstacles).flat().forEach(obstacle => {
            if (obstacle.isActive()) {
                obstacle.update();
            }
        });
        
        // Try to spawn new obstacle
        this.spawnObstacle();
    }

    getActiveObstacles() {
        const activeObs = Object.values(this.obstacles)
            .flat()
            .filter(obstacle => obstacle.isActive())
            .map(obstacle => obstacle.getSprite());
        
        this.debugLog(`Active obstacles count: ${activeObs.length}`);
        return activeObs;
    }
}