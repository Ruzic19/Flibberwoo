export const OBSTACLE_CONFIG = {
    POOL_SIZE: 5,
    TYPES: {
        SMALL: 'spikes',
        MEDIUM: 'box',
        LARGE: 'rock-head'
    },
    SPAWN: {
        MIN_DISTANCE: 3000,
        MAX_DISTANCE: 18000,  // Added: 3x the MIN_DISTANCE
        INITIAL_DELAY: 4000,
        BASE_SPEED: 60,     // Reduced to match floor layer speed
        Y_POSITION: {
            SMALL: 0.93,
            MEDIUM: 0.93,
            LARGE: 0.9
        }
    },
    DIFFICULTY: {
        SPEED_INCREMENT: 2,  // Reduced for smoother acceleration
        DISTANCE_DECREMENT: 250,
        INTERVAL: 15000,
        MIN_SPAWN_DISTANCE: 4000,
        MAX_SPAWN_DISTANCE: 12000,  // Added: 3x the MIN_SPAWN_DISTANCE
        MAX_SPEED: 120      // Reduced max speed to stay in sync
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2
    }
};