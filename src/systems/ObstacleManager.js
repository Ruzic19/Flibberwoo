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
        
        this.nextSpawnTime = this.scene.time.now + OBSTACLE_CONFIG.SPAWN.INITIAL_DELAY;
        this.currentSpeed = OBSTACLE_CONFIG.SPAWN.BASE_SPEED;
        this.groupMode = false;
        this.remainingGroupSize = 0;
        
        this.debugLog('Initializing obstacle manager');
        
        // Log all existing physics bodies before pool creation
        this.debugLog('Physics bodies before pool creation:', 
            this.scene.physics.world.bodies.entries.map(body => ({
                x: body.x,
                y: body.y,
                width: body.width,
                height: body.height,
                key: body.gameObject?.texture?.key || 'unknown',
                type: body.gameObject?.constructor?.name || 'unknown',
                depth: body.gameObject?.depth || 0,
                active: body.gameObject?.active || false,
                visible: body.gameObject?.visible || false
            }))
        );
        
        this.initializePool();
        
        // Find and log any graphics objects that might be causing the green lines
        const allGraphics = this.scene.children.list
            .filter(child => child instanceof Phaser.GameObjects.Graphics);
        
        if (allGraphics.length > 0) {
            this.debugLog('Found graphics objects:', allGraphics.map(g => ({
                depth: g.depth,
                visible: g.visible,
                active: g.active,
                position: { x: g.x, y: g.y }
            })));
        }
        
        // Log all physics bodies after pool creation
        this.debugLog('Physics bodies after pool creation:', 
            this.scene.physics.world.bodies.entries.map(body => ({
                x: body.x,
                y: body.y,
                width: body.width,
                height: body.height,
                key: body.gameObject?.texture?.key || 'unknown',
                type: body.gameObject?.constructor?.name || 'unknown',
                depth: body.gameObject?.depth || 0,
                active: body.gameObject?.active || false,
                visible: body.gameObject?.visible || false
            }))
        );
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

    calculateSpawnDelay() {
        let distance;
        
        if (!this.groupMode && Math.random() < OBSTACLE_CONFIG.SPAWN.GROUP_CHANCE) {
            this.groupMode = true;
            this.remainingGroupSize = Math.floor(
                Math.random() * 
                (OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MAX - OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MIN + 1) + 
                OBSTACLE_CONFIG.SPAWN.GROUP_SIZE.MIN
            );
            this.debugLog('Starting new group', { size: this.remainingGroupSize });
        }

        if (this.groupMode) {
            distance = Math.random() * 
                (OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX - OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN) + 
                OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN;
            
            this.remainingGroupSize--;
            if (this.remainingGroupSize <= 0) {
                this.groupMode = false;
                distance += Math.random() * 
                    (OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MAX - OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN) + 
                    OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN;
            }
        } else {
            distance = Math.random() * 
                (OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MAX - OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN) + 
                OBSTACLE_CONFIG.SPAWN.GAP_SPACING.MIN;
        }

        const delay = (distance / this.currentSpeed) * 1000;
        
        return { distance, delay };
    }

    calculateBaseSpeed() {
        const baseGameSpeed = GAME_CONFIG.SCROLL_SPEED.BASE;
        const parallaxFactor = 0.5;
        return baseGameSpeed * parallaxFactor * window.devicePixelRatio * 20;
    }

    getCurrentSpeed() {
        return this.calculateBaseSpeed() * this.speedMultiplier;
    }

    getInactiveObstacle(type) {
        return this.obstacles[type].find(obs => !obs.isActive());
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
        this.currentSpeed = Math.min(
            this.currentSpeed + speedIncrement,
            OBSTACLE_CONFIG.DIFFICULTY.MAX_SPEED
        );
        
        OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN = Math.max(
            OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN - distanceDecrement,
            100
        );
        OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX = Math.max(
            OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX - distanceDecrement,
            200
        );

        this.debugLog('Difficulty updated', {
            newSpeed: this.currentSpeed,
            newGroupSpacingMin: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MIN,
            newGroupSpacingMax: OBSTACLE_CONFIG.SPAWN.GROUP_SPACING.MAX
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