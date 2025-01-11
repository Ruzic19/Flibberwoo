import { GAME_CONFIG } from '../config/gameConfig';
import { ANIMATIONS } from '../constants/AnimationKeys';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, 'run-1')
            .setDepth(12)
            .setScale(GAME_CONFIG.PLAYER.SCALE)
            .setOrigin(0.5, 0.5);
        
        this.initialY = y;
        this.isJumping = false;
        this.isCrouching = false;
        this.currentVelocity = 0;
        this.jumpHeight = 0;
        this.isHoldingJump = false;

        // Set pixel-art friendly scaling
        this.sprite.texture.setFilter(Phaser.Textures.NEAREST);
        
        this.setupControls();
        this.setupAnimationListeners();
        this.sprite.play(ANIMATIONS.RUN);
    }

    setupControls() {
        this.scene.input.keyboard.on('keydown-W', () => {
            if (!this.isJumping && !this.isCrouching) {
                this.startJump();
            }
        });

        this.scene.input.keyboard.on('keyup-W', () => {
            this.releaseJump();
        });

        this.scene.input.keyboard.on('keydown-S', () => {
            if (!this.isJumping && !this.isCrouching) {
                this.startCrouch();
            }
        });

        this.scene.input.keyboard.on('keyup-S', () => {
            if (this.isCrouching) {
                this.endCrouch();
            }
        });
    }

    setupAnimationListeners() {
        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === ANIMATIONS.JUMP) {
                this.isJumping = false;
                if (!this.isCrouching) {
                    this.sprite.play(ANIMATIONS.RUN);
                }
            }
        });
    }

    startJump() {
        this.isJumping = true;
        this.isHoldingJump = true;
        this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.JUMP_VELOCITY;
        this.sprite.play(ANIMATIONS.JUMP);
    }

    releaseJump() {
        this.isHoldingJump = false;
        if (this.isJumping && this.currentVelocity < 0) {
            this.currentVelocity = this.currentVelocity / 2;
        }
    }

    startCrouch() {
        this.isCrouching = true;
        this.sprite.play(ANIMATIONS.CROUCH);
    }

    endCrouch() {
        this.isCrouching = false;
        this.sprite.play(ANIMATIONS.RUN);
    }

    updateJump() {
        if (this.isHoldingJump && this.currentVelocity < 0) {
            let force = GAME_CONFIG.PLAYER.PHYSICS.HOLD_JUMP_FORCE;
            if (Math.abs(this.currentVelocity) < 2) {
                force *= 0.5;
            }
            this.currentVelocity += force;
        }
        
        this.sprite.y += this.currentVelocity;
        this.currentVelocity += GAME_CONFIG.PLAYER.PHYSICS.GRAVITY;
        
        this.jumpHeight = this.initialY - this.sprite.y;
        
        if (this.jumpHeight > GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT) {
            this.sprite.y = this.initialY - GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT;
            this.currentVelocity = 0;
        }

        if (this.sprite.y >= this.initialY) {
            this.land();
        }
    }

    land() {
        this.sprite.y = this.initialY;
        this.isJumping = false;
        this.currentVelocity = 0;
        this.jumpHeight = 0;
        this.sprite.play(ANIMATIONS.RUN);
    }

    update() {
        if (this.isJumping) {
            this.updateJump();
        }
    }
}