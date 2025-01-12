export class PlayerState {
    constructor() {
        this.isJumping = false;
        this.isCrouching = false;
        this.canJump = true;
        this.canCrouch = true;
        this.crouchTimer = null;
    }

    setJumping(value) {
        this.isJumping = value;
    }

    setCrouching(value) {
        this.isCrouching = value;
    }

    setCanJump(value) {
        this.canJump = value;
    }

    setCanCrouch(value) {
        this.canCrouch = value;
    }

    setCrouchTimer(timer) {
        this.crouchTimer = timer;
    }

    isInJump() {
        return this.isJumping;
    }

    isInCrouch() {
        return this.isCrouching;
    }

    canPerformJump() {
        return this.canJump;
    }

    canPerformCrouch() {
        return this.canCrouch;
    }

    getCrouchTimer() {
        return this.crouchTimer;
    }
}
