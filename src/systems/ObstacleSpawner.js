// src/systems/ObstacleSpawner.js
import { OBSTACLE_CONFIG } from '../config/obstacleConfig';
import { logger } from '../utils/LogManager';
import { debugOverlay } from '../debug/DebugOverlay';

export class ObstacleSpawner {
    constructor(scene, obstaclePool) {
        this.scene = scene;
        this.obstaclePool = obstaclePool;
        this.moduleName = 'ObstacleSpawner';
        this.nextSpawnTime = this.scene.time.now + OBSTACLE_CONFIG.SPAWN.INITIAL_DELAY;
        
        // Calculate initial speed
        this.currentSpeed = OBSTACLE_CONFIG.SPAWN.BASE_SPEED;
        this.groupMode = false;
        this.remainingGroupSize = 0;

        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        logger.info(this.moduleName, 'Initializing obstacle spawner', {
            initialSpeed: this.currentSpeed,
            initialDelay: OBSTACLE_CONFIG.SPAWN.INITIAL_DELAY
        });
    }

    updateSpeed(newSpeed) {
        const oldSpeed = this.currentSpeed;
        this.currentSpeed = Math.min(newSpeed, OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED);
        
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Speed updated', {
                oldSpeed,
                newSpeed: this.currentSpeed,
                wasLimited: newSpeed > OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED
            });
        }

        if (newSpeed > OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED) {
            logger.warn(this.moduleName, 'Speed capped at maximum limit', {
                requested: newSpeed,
                applied: this.currentSpeed
            });
        }
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
                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Group completed, adding gap distance');
                }
            }
        }

        const delay = (distance / this.currentSpeed) * 1000;
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Spawn timing calculated', { 
                distance,
                speed: this.currentSpeed,
                delay,
                groupMode: this.groupMode,
                remainingInGroup: this.remainingGroupSize
            });
        }

        return { distance, delay };
    }

    startGroupMode() {
        this.groupMode = true;
        this.remainingGroupSize = Math.floor(
            Math.random() * 
            (OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MAX - OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MIN + 1) + 
            OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MIN
        );

        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Starting new obstacle group', { 
                groupSize: this.remainingGroupSize,
                groupConfig: {
                    min: OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MIN,
                    max: OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MAX
                }
            });
        }
    }

    calculateDistance() {
        if (this.groupMode) {
            const distance = Math.random() * 
                (OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX - OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN) + 
                OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN;
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Group spacing calculated', {
                    distance,
                    config: {
                        min: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN,
                        max: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX
                    }
                });
            }
            return distance;
        }
        return this.calculateGapDistance();
    }

    calculateGapDistance() {
        const distance = Math.random() * 
            (OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MAX - OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN) + 
            OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN;
            
        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Gap distance calculated', {
                distance,
                config: {
                    min: OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN,
                    max: OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MAX
                }
            });
        }
        return distance;
    }

    spawn() {
        const currentTime = this.scene.time.now;
        
        if (currentTime < this.nextSpawnTime) {
            return;
        }

        try {
            const types = Object.values(OBSTACLE_CONFIG.TYPES);
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            const obstacle = this.obstaclePool.getInactiveObstacle(randomType);
            if (!obstacle) {
                logger.warn(this.moduleName, 'No inactive obstacles available', { type: randomType });
                return;
            }

            const x = this.scene.cameras.main.width + 100;
            const y = this.scene.cameras.main.height * 
                OBSTACLE_CONFIG.SPAWN.Y_POSITION[this.getTypeName(randomType)];
            
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Spawning obstacle', { 
                    type: randomType,
                    position: { x, y },
                    speed: this.currentSpeed,
                    groupMode: this.groupMode,
                    remainingInGroup: this.remainingGroupSize
                });
            }
            
            obstacle.enable(x, y, this.currentSpeed);
            
            const { delay } = this.calculateSpawnDelay();
            this.nextSpawnTime = currentTime + delay;

        } catch (error) {
            logger.error(this.moduleName, 'Error spawning obstacle', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    getTypeName(type) {
        const entry = Object.entries(OBSTACLE_CONFIG.TYPES)
            .find(([key, value]) => value === type);
        return entry ? entry[0] : 'UNKNOWN';
    }
}