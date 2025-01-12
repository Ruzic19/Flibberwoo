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
            JUMP_VELOCITY: -6,         // Reduced initial velocity for less sensitivity
            GRAVITY: 0.2,             // Reduced gravity for slower fall
            MAX_JUMP_HEIGHT: 200,     // Increased maximum height
            HOLD_JUMP_FORCE: -0.3     // Reduced hold force for more controlled ascent
        }
    },
    SCROLL_SPEED: {
        BASE: 2
    }
};