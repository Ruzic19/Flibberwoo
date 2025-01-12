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
            JUMP_VELOCITY: -8,         // Upward velocity
            FALL_VELOCITY: 4.4,          // Fall velocity increased by 10%
            GRAVITY: 0.1,              // Small gravity for reliable falling
            MAX_JUMP_HEIGHT: 750,      // Maximum jump height
            HOLD_JUMP_FORCE: 0         // No hold force needed
        }
    },
    SCROLL_SPEED: {
        BASE: 10                        // Doubled from 2 to 10 for faster game speed
    }
};