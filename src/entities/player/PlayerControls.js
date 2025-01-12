// src/entities/player/PlayerControls.js
export class PlayerControls {
    constructor(scene, callbacks) {
        this.scene = scene;
        this.callbacks = callbacks;
        this.jumpKeyPressed = false;
        this.crouchKeyPressed = false;
        this.debug = true;
    }

    setup() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) {
            console.error('Keyboard not available');
            return;
        }

        keyboard.on('keydown-W', () => {
            if (!this.jumpKeyPressed) {
                this.jumpKeyPressed = true;
                if (this.debug) console.log('Jump key pressed');
                this.callbacks.onJumpStart?.();
            }
        });

        keyboard.on('keyup-W', () => {
            this.jumpKeyPressed = false;
            if (this.debug) console.log('Jump key released');
            this.callbacks.onJumpEnd?.();
        });

        keyboard.on('keydown-S', () => {
            if (!this.crouchKeyPressed) {
                this.crouchKeyPressed = true;
                if (this.debug) console.log('Crouch key pressed');
                this.callbacks.onCrouchStart?.();
            }
        });

        keyboard.on('keyup-S', () => {
            this.crouchKeyPressed = false;
            if (this.debug) console.log('Crouch key released');
            this.callbacks.onCrouchEnd?.();
        });
    }

    isJumpKeyPressed() {
        return this.jumpKeyPressed;
    }

    isCrouchKeyPressed() {
        return this.crouchKeyPressed;
    }
}