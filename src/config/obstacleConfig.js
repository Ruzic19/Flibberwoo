export const OBSTACLE_CONFIG = {
    POOL_SIZE: 5,
    TYPES: {
        SMALL: 'spikes',
        MEDIUM: 'box',
        LARGE: 'rock-head'
    },
    SPAWN: {
        MIN_DISTANCE: 833,  // Reduced to 1/3 of previous value (2500/3)
        MAX_DISTANCE: 3000, // Also reduced for better game flow
        INITIAL_DELAY: 2000,
        BASE_SPEED: 600,    // Matched with layer1's movement speed
        Y_POSITION: {
            SMALL: 0.93,
            MEDIUM: 0.93,
            LARGE: 0.9
        }
    },
    DIFFICULTY: {
        SPEED_INCREMENT: 20,
        DISTANCE_DECREMENT: 100,
        INTERVAL: 15000,
        MIN_SPAWN_DISTANCE: 100,  // Matches new MIN_DISTANCE
        MAX_SPAWN_DISTANCE: 750, // Matches new MAX_DISTANCE
        MAX_SPEED: 1200          // Increased to maintain difficulty progression
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2
    }
};