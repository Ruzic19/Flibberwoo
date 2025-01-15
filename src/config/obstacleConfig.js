export const OBSTACLE_CONFIG = {
    POOL_SIZE: 5,
    TYPES: {
        SMALL: 'spikes',
        MEDIUM: 'box',
        LARGE: 'rock-head'
    },
    SPAWN: {
        MIN_DISTANCE: 150,
        MAX_DISTANCE: 750,
        INITIAL_DELAY: 2000,
        BASE_SPEED: 300,     
        GROUP_CHANCE: 0.4,    
        GROUP_SIZE: {
            MIN: 2,          
            MAX: 4           
        },
        GROUP_SPACING: {
            MIN: 250,
            MAX: 300
        },
        GAP_SPACING: {
            MIN: 600,
            MAX: 750
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
        MIN_SPAWN_DISTANCE: 150,
        MAX_SPAWN_DISTANCE: 750,
        MAX_SPEED: 1200
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2
    }
};