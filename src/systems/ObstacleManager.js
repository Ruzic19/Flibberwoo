// src/systems/ObstacleManager.js
import { GAME_CONFIG } from '../config/gameConfig';
import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { Obstacle } from '../entities/obstacles/Obstacle';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.debug = true;
        
        this.obstacles = {
            [OBSTACLE_CONFIG.TYPES.SMALL]: [],
            [OBSTACLE_CONFIG.TYPES.MEDIUM]: [],
            [OBSTACLE_CONFIG.TYPES.LARGE]: []
        };
        
        // Initialize timing and speed
        this.nextSpawnTime = this.scene.time.now + OBSTACLE_CONFIG.SPAWN.INITIAL_DELAY;
        this.currentSpeed = OBSTACLE_CONFIG.SPAWN.BASE_SPEED;
        this.currentMinDistance = OBSTACLE_CONFIG.SPAWN.MIN_DISTANCE;
        this.currentMaxDistance = OBSTACLE_CONFIG.SPAWN.MAX_DISTANCE;
        
        this.debugLog('Initializing obstacle manager');
        this.initializePool();
    }

    calculateSpawnDelay() {
        const distance = this.getRandomDistance();
        // Convert pixels to time based on current speed
        const delay = (distance / this.currentSpeed) * 1000;
        return { distance, delay };
    }

    calculateBaseSpeed() {
        // Calculate speed based on game config and parallax effect
        const baseGameSpeed = GAME_CONFIG.SCROLL_SPEED.BASE;
        const parallaxFactor = 0.5; // Maximum parallax factor for foreground
        return baseGameSpeed * parallaxFactor * window.devicePixelRatio * 20; // Scale factor to match visual speed
    }

    getCurrentSpeed() {
        return this.calculateBaseSpeed() * this.speedMultiplier;
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
            }
        });
    }

    getInactiveObstacle(type) {
        return this.obstacles[type].find(obs => !obs.isActive());
    }

    getRandomDistance() {
        return Math.random() * (this.currentMaxDistance - this.currentMinDistance) + this.currentMinDistance;
    }

    spawnObstacle() {
        const currentTime = this.scene.time.now;
        
        if (currentTime < this.nextSpawnTime) {
            return;
        }

        const types = Object.values(OBSTACLE_CONFIG.TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const obstacle = this.getInactiveObstacle(randomType);
        if (!obstacle) {
            return;
        }

        const x = this.scene.cameras.main.width + 100;
        const y = this.scene.cameras.main.height * 
            OBSTACLE_CONFIG.SPAWN.Y_POSITION[this.getTypeName(randomType)];
        
        this.debugLog(`Spawning obstacle at position`, { x, y, speed: this.currentSpeed });
        
        obstacle.enable(x, y, this.currentSpeed);
        
        // Calculate next spawn time
        const { distance, delay } = this.calculateSpawnDelay();
        this.nextSpawnTime = currentTime + delay;

        this.debugLog('Spawn calculation', {
            distance,
            delay,
            speed: this.currentSpeed,
            nextSpawn: new Date(this.nextSpawnTime).toISOString()
        });
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }

    updateDifficulty(speedIncrement, distanceDecrement) {
        // Update speed with bounds checking
        this.currentSpeed = Math.min(
            this.currentSpeed + speedIncrement,
            OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED
        );
        
        // Update distances with bounds checking
        this.currentMinDistance = Math.max(
            this.currentMinDistance - distanceDecrement,
            OBSTACLE_CONFIG.DIFFICULTY.MIN_SPAWN_DISTANCE
        );
        
        this.currentMaxDistance = Math.max(
            this.currentMaxDistance - distanceDecrement,
            OBSTACLE_CONFIG.DIFFICULTY.MAX_SPAWN_DISTANCE
        );

        this.debugLog('Difficulty updated', {
            newSpeed: this.currentSpeed,
            newMinDistance: this.currentMinDistance,
            newMaxDistance: this.currentMaxDistance
        });
    }

    update() {
        Object.values(this.obstacles).flat().forEach(obstacle => {
            if (obstacle.isActive()) {
                obstacle.update();
            }
        });
        
        this.spawnObstacle();
    }

    getActiveObstacles() {
        return Object.values(this.obstacles)
            .flat()
            .filter(obstacle => obstacle.isActive())
            .map(obstacle => obstacle.getSprite());
    }
}