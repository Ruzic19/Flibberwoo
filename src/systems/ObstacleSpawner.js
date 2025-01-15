import { OBSTACLE_CONFIG } from '../config/obstacleConfig';

export class ObstacleSpawner {
    constructor(scene, obstaclePool) {
        this.scene = scene;
        this.obstaclePool = obstaclePool;
        this.nextSpawnTime = this.scene.time.now + OBSTACLE_CONFIG.SPAWN.INITIAL_DELAY;
        this.currentSpeed = OBSTACLE_CONFIG.SPAWN.BASE_SPEED;
        this.groupMode = false;
        this.remainingGroupSize = 0;
        this.debug = false;
    }

    updateSpeed(newSpeed) {
        this.currentSpeed = Math.min(newSpeed, OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED);
    }

    calculateSpawnDelay() {
        let distance;
        
        if (!this.groupMode && Math.random() < OBSTACLE_CONFIG.SPAWN.GROUP_CHANCE) {
            this.startGroupMode();
        }

        distance = this.calculateDistance();
        
        if (this.groupMode) {
            this.remainingGroupSize--;
            if (this.remainingGroupSize <= 0) {
                this.groupMode = false;
                distance += this.calculateGapDistance();
            }
        }

        return { 
            distance, 
            delay: (distance / this.currentSpeed) * 1000 
        };
    }

    startGroupMode() {
        this.groupMode = true;
        this.remainingGroupSize = Math.floor(
            Math.random() * 
            (OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MAX - OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MIN + 1) + 
            OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MIN
        );

        if (this.debug) {
            console.log('[ObstacleSpawner] Starting new group', { 
                size: this.remainingGroupSize 
            });
        }
    }

    calculateDistance() {
        if (this.groupMode) {
            return Math.random() * 
                (OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX - OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN) + 
                OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN;
        }
        return this.calculateGapDistance();
    }

    calculateGapDistance() {
        return Math.random() * 
            (OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MAX - OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN) + 
            OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN;
    }

    spawn() {
        const currentTime = this.scene.time.now;
        
        if (currentTime < this.nextSpawnTime) {
            return;
        }

        const types = Object.values(OBSTACLE_CONFIG.TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const obstacle = this.obstaclePool.getInactiveObstacle(randomType);
        if (!obstacle) {
            return;
        }

        const x = this.scene.cameras.main.width + 100;
        const y = this.scene.cameras.main.height * 
            OBSTACLE_CONFIG.SPAWN.Y_POSITION[this.getTypeName(randomType)];
        
        if (this.debug) {
            console.log(`[ObstacleSpawner] Spawning obstacle at position`, { 
                x, y, speed: this.currentSpeed 
            });
        }
        
        obstacle.enable(x, y, this.currentSpeed);
        
        const { delay } = this.calculateSpawnDelay();
        this.nextSpawnTime = currentTime + delay;
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }
}