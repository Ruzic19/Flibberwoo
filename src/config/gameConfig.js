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
        // PHYSICS: {
        //     JUMP_VELOCITY: -7,
        //     FALL_VELOCITY: 4.25,
        //     GRAVITY: 0.1,
        //     MAX_JUMP_HEIGHT: 230,
        //     HOLD_JUMP_FORCE: 0
        // }
        PHYSICS: {
            JUMP_VELOCITY: -12,
            FALL_VELOCITY: 8,
            GRAVITY: 0.4,
            MAX_JUMP_HEIGHT: 230,
            HOLD_JUMP_FORCE: 0
        }
    },
    SCROLL_SPEED: {
        BASE: 3
    }
};