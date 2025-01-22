export const OBSTACLE_CONFIG = {
    POOL_SIZE: 5,
    TYPES: {
        SMALL: 'spikes',
        MEDIUM: 'box',
        LARGE: 'rock-head',
        BEE: 'bee'
    },
    SPAWN: {
        MIN_DISTANCE: 250,
        MAX_DISTANCE: 750,
        INITIAL_DELAY: 2000,
        BASE_SPEED: 300,     // Adjusted to match background movement
        GROUP_CHANCE: 0.4,    
        GROUP_SIZE: {
            MIN: 2,          
            MAX: 4           
        },
        GROUP_SPACING: {
            MIN: 375,
            MAX: 500
        },
        GAP_SPACING: {
            MIN: 500,
            MAX: 650
        },
        Y_POSITION: {
            SMALL: 0.93,
            MEDIUM: 0.93,
            LARGE: 0.9,
            BEE: 0.85    // Bee spawns higher in the air
        }
    },
    DIFFICULTY: {
        SPEED_INCREMENT: 35, //Adjusted difficulty scaling for neww base speed 
        DISTANCE_DECREMENT: 50,
        INTERVAL: 15000,
        MIN_SPAWN_DISTANCE: 150,
        MAX_SPAWN_DISTANCE: 750,
        MAX_SPEED: 2000 // Increased to account for higher base speed
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2,
        BEE: 0.75
    },
    ANIMATIONS: {
        BEE: {
            key: 'bee-fly',
            frameWidth: 64,
            frameHeight: 64,
            frameRate: 10,
            frames: 4,
            repeat: -1,
            verticalMovement: {
                minY: 0.55,
                maxY: 0.85,
                speed: {
                    min: 0.006,
                    max: 0.009
                }
            }
        }
    }
};