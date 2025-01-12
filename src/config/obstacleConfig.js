export const OBSTACLE_CONFIG = {
    POOL_SIZE: 5,
    TYPES: {
        SMALL: 'spikes',
        MEDIUM: 'box',
        LARGE: 'rock-head'
    },
    SPAWN: {
        MIN_DISTANCE: 2500,
        MAX_DISTANCE: 9000,
        INITIAL_DELAY: 4000,
        BASE_SPEED: 240,    // Changed from 60 to 240 (5x the original speed of 60)
        Y_POSITION: {
            SMALL: 0.93,
            MEDIUM: 0.93,
            LARGE: 0.9
        }
    },
    DIFFICULTY: {
        SPEED_INCREMENT: 10,  // Changed from 2 to 10 (5x the original increment)
        DISTANCE_DECREMENT: 250,
        INTERVAL: 15000,
        MIN_SPAWN_DISTANCE: 4000,
        MAX_SPAWN_DISTANCE: 12000,
        MAX_SPEED: 600      // Changed from 120 to 600 (5x the original max speed)
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2
    }
};