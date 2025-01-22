// src/entities/player/PlayerControls.js
import { logger } from '../../utils/LogManager';
import { debugOverlay } from '../../debug/DebugOverlay';

export class PlayerControls {
    constructor(scene, callbacks) {
        this.scene = scene;
        this.callbacks = callbacks;
        this.jumpKeyPressed = false;
        this.crouchKeyPressed = false;
        this.moduleName = 'PlayerControls';
        
        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        logger.info(this.moduleName, 'Initializing player controls');
    }

    setup() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) {
            logger.error(this.moduleName, 'Keyboard input not available');
            return;
        }

        try {
            // Jump controls
            this.setupJumpControls(keyboard);
            
            // Crouch controls
            this.setupCrouchControls(keyboard);
            
            logger.info(this.moduleName, 'Control mappings established');
        } catch (error) {
            logger.error(this.moduleName, 'Failed to setup controls', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    setupJumpControls(keyboard) {
        keyboard.on('keydown-W', () => {
            if (!this.jumpKeyPressed) {
                this.jumpKeyPressed = true;
                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Jump key pressed', {
                        crouchState: this.crouchKeyPressed
                    });
                }
                
                try {
                    this.callbacks.onJumpStart?.();
                } catch (error) {
                    logger.error(this.moduleName, 'Error in jump start callback', {
                        error: error.message
                    });
                }
            }
        });

        keyboard.on('keyup-W', () => {
            this.jumpKeyPressed = false;
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Jump key released');
            }
            
            try {
                this.callbacks.onJumpEnd?.();
            } catch (error) {
                logger.error(this.moduleName, 'Error in jump end callback', {
                    error: error.message
                });
            }
        });

        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Jump controls configured');
        }
    }

    setupCrouchControls(keyboard) {
        keyboard.on('keydown-S', () => {
            if (!this.crouchKeyPressed) {
                this.crouchKeyPressed = true;
                if (debugOverlay.isDebugEnabled(this.moduleName)) {
                    logger.debug(this.moduleName, 'Crouch key pressed', {
                        jumpState: this.jumpKeyPressed
                    });
                }
                
                try {
                    this.callbacks.onCrouchStart?.();
                } catch (error) {
                    logger.error(this.moduleName, 'Error in crouch start callback', {
                        error: error.message
                    });
                }
            }
        });

        keyboard.on('keyup-S', () => {
            this.crouchKeyPressed = false;
            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Crouch key released');
            }
            
            try {
                this.callbacks.onCrouchEnd?.();
            } catch (error) {
                logger.error(this.moduleName, 'Error in crouch end callback', {
                    error: error.message
                });
            }
        });

        if (debugOverlay.isDebugEnabled(this.moduleName)) {
            logger.debug(this.moduleName, 'Crouch controls configured');
        }
    }

    isJumpKeyPressed() {
        return this.jumpKeyPressed;
    }

    isCrouchKeyPressed() {
        return this.crouchKeyPressed;
    }

    cleanup() {
        try {
            const keyboard = this.scene.input.keyboard;
            if (keyboard) {
                keyboard.removeAllKeys(true);
                logger.info(this.moduleName, 'Control mappings cleaned up');
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error during controls cleanup', {
                error: error.message
            });
        }
    }
}