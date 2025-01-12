// src/config/obstacleConfig.js
export const OBSTACLE_CONFIG = {
    POOL_SIZE: 5,
    TYPES: {
        SMALL: 'spikes',
        MEDIUM: 'box',
        LARGE: 'rock-head'
    },
    SPAWN: {
        MIN_DISTANCE: 400,
        MAX_DISTANCE: 1200,
        INITIAL_DELAY: 1600,
        // 1.67 pixels per frame * 60 frames = 100 pixels per second
        BASE_SPEED: 100,    // Changed from 300 to 100 (3 times slower)
        Y_POSITION: {
            SMALL: 0.93,
            MEDIUM: 0.93,
            LARGE: 0.9
        }
    },
    DIFFICULTY: {
        SPEED_INCREMENT: 10,   // Changed from 30 to 10
        DISTANCE_DECREMENT: 50,
        INTERVAL: 15000,
        MIN_SPAWN_DISTANCE: 300,
        MAX_SPAWN_DISTANCE: 1000,
        MAX_SPEED: 200        // Changed from 600 to 200
    },
    SCALE: {
        SMALL: 2,
        MEDIUM: 2,
        LARGE: 2
    }
};