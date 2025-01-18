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
        BASE_SPEED: 180,     // Adjusted to match background movement
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
        SPEED_INCREMENT: 20,
        DISTANCE_DECREMENT: 50,
        INTERVAL: 15000,
        MIN_SPAWN_DISTANCE: 150,
        MAX_SPAWN_DISTANCE: 750,
        MAX_SPEED: 1200
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2,
        BEE: 0.75
    },
    ANIMATIONS: {
        BEE: {
            frameWidth: 64,   // Adjust based on your sprite sheet
            frameHeight: 64,  // Adjust based on your sprite sheet
            frameRate: 10,
            frames: 4,        // Number of frames in the bee animation
            // Add vertical movement configuration
            verticalMovement: {
                minY: 0.7,    // Minimum Y position ratio
                maxY: 0.85,   // Maximum Y position ratio
                speed: 0.002, // Speed of vertical movement (adjust as needed)
                speed: {
                    min: 0.004,  // Minimum speed of vertical movement
                    max: 0.007   // Maximum speed of vertical movement
                }
            }
        }
    }
};