export class PlayerPhysics {
    constructor(config) {
        this.config = config;
        this.currentVelocity = 0;
        this.jumpHeight = 0;
        this.isHoldingJump = false;
        this.lastUpdateTime = 0;
    }

    startJump() {
        this.currentVelocity = this.config.JUMP_VELOCITY;
        this.jumpHeight = 0;
        this.isHoldingJump = true;
        this.lastUpdateTime = performance.now();
    }

    releaseJump() {
        this.isHoldingJump = false;
        if (this.currentVelocity < 0) {
            this.currentVelocity = this.currentVelocity / 2;
        }
    }

    updateJump(currentY, initialY) {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60); // Normalize to 60 FPS
        this.lastUpdateTime = currentTime;

        this.jumpHeight = initialY - currentY;

        if (this.jumpHeight >= this.config.MAX_JUMP_HEIGHT) {
            this.currentVelocity = this.config.FALL_VELOCITY;
            this.isHoldingJump = false;
        } else if (!this.isHoldingJump) {
            this.currentVelocity = this.config.FALL_VELOCITY;
        }

        // Apply gravity with deltaTime
        this.currentVelocity += this.config.GRAVITY * deltaTime;
        
        // Apply velocity with deltaTime
        let newY = currentY + (this.currentVelocity * deltaTime);

        if (this.jumpHeight > this.config.MAX_JUMP_HEIGHT) {
            newY = initialY - this.config.MAX_JUMP_HEIGHT;
            this.currentVelocity = Math.abs(this.config.JUMP_VELOCITY);
        }

        return {
            newY,
            shouldLand: this.currentVelocity > 0 && newY >= initialY
        };
    }

    reset() {
        this.currentVelocity = 0;
        this.jumpHeight = 0;
        this.isHoldingJump = false;
        this.lastUpdateTime = performance.now();
    }
}