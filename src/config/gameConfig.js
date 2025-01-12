export const GAME_CONFIG = {
    ORIGINAL_WIDTH: 928,
    ORIGINAL_HEIGHT: 793,
    HEIGHT_TO_SHOW: 600,
    VERTICAL_OFFSET: 300,
    PLAYER: {
        SCALE: 4,
        INITIAL_POSITION: {
            X_RATIO: 0.2,
            Y_RATIO: 0.82
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
        BASE: 3  // Reduced from 10 to 5 to slow down by 200%
    }
};