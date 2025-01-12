// src/config/gameConfig.js
export const GAME_CONFIG = {
    ORIGINAL_WIDTH: 928,
    ORIGINAL_HEIGHT: 793,
    HEIGHT_TO_SHOW: 600,
    VERTICAL_OFFSET: 300,
    PLAYER: {
        SCALE: 2,
        INITIAL_POSITION: {
            X_RATIO: 0.2,
            Y_RATIO: 0.9
        },
        PHYSICS: {
            JUMP_VELOCITY: -8,
            FALL_VELOCITY: 4.4,
            GRAVITY: 0.1,
            MAX_JUMP_HEIGHT: 750,
            HOLD_JUMP_FORCE: 0
        }
    },
    SCROLL_SPEED: {
        BASE: 1.67  // Changed from 5 to 1.67 (3 times slower)
    }
};