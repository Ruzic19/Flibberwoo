export const GAME_CONFIG = {
    ORIGINAL_WIDTH: 928,
    ORIGINAL_HEIGHT: 793,
    HEIGHT_TO_SHOW: 600,
    VERTICAL_OFFSET: 300,
    PLAYER: {
        SCALE: 3,
        INITIAL_POSITION: {
            X_RATIO: 0.2,
            Y_RATIO: 0.86
        },
        PHYSICS: {
            JUMP_VELOCITY: -12,
            FALL_VELOCITY: 8,
            GRAVITY: 0.4,
            MAX_JUMP_HEIGHT: 230,
            HOLD_JUMP_FORCE: 0
        }
    },
    SCROLL_SPEED: {
        BASE: 3,           // Base speed
        INCREMENT: 1,      // Smaller increment for smoother acceleration
        MAX_SPEED: 20      // Maximum speed that won't break the game
    }
};