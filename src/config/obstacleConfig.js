export const OBSTACLE_CONFIG = {
    POOL_SIZE: 5,
    TYPES: {
        SMALL: 'spikes',
        MEDIUM: 'box',
        LARGE: 'rock-head'
    },
    SPAWN: {
        MIN_DISTANCE: 150,    // Increased from 100
        MAX_DISTANCE: 750,    // Kept the same
        INITIAL_DELAY: 2000,
        BASE_SPEED: 600,     
        GROUP_CHANCE: 0.4,    
        GROUP_SIZE: {
            MIN: 2,          
            MAX: 4           
        },
        GROUP_SPACING: {
            MIN: 150,        // Increased from 100
            MAX: 300         // Increased proportionally
        },
        GAP_SPACING: {
            MIN: 600,        // Increased from 400
            MAX: 750         // Kept the same
        },
        Y_POSITION: {
            SMALL: 0.93,
            MEDIUM: 0.93,
            LARGE: 0.9
        }
    },
    DIFFICULTY: {
        SPEED_INCREMENT: 20,
        DISTANCE_DECREMENT: 50,
        INTERVAL: 15000,
        MIN_SPAWN_DISTANCE: 150,  // Increased from 100
        MAX_SPAWN_DISTANCE: 750,
        MAX_SPEED: 1200
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2
    }
};