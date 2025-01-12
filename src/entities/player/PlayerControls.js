export class PlayerControls {
    constructor(scene, callbacks) {
        this.scene = scene;
        this.callbacks = callbacks;
        this.jumpKeyPressed = false;
        this.crouchKeyPressed = false;
    }

    setup() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) return;

        keyboard.on('keydown-W', () => {
            if (!this.jumpKeyPressed) {
                this.jumpKeyPressed = true;
                this.callbacks.onJumpStart?.();
            }
        });

        keyboard.on('keyup-W', () => {
            this.jumpKeyPressed = false;
            this.callbacks.onJumpEnd?.();
        });

        keyboard.on('keydown-S', () => {
            if (!this.crouchKeyPressed) {
                this.crouchKeyPressed = true;
                this.callbacks.onCrouchStart?.();
            }
        });

        keyboard.on('keyup-S', () => {
            this.crouchKeyPressed = false;
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