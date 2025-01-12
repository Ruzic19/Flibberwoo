import { GAME_CONFIG } from '../config/gameConfig';
import { ANIMATIONS } from '../constants/AnimationKeys';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create the sprite with pixel art optimizations
        this.sprite = scene.add.sprite(x, y, 'run-1')
            .setDepth(12)
            .setScale(GAME_CONFIG.PLAYER.SCALE)
            .setOrigin(0.5, 0.5);
        
        // Apply pixel art optimizations
        this.sprite.texture.setFilter(Phaser.Textures.LINEAR);
        
        // Ensure the sprite position snaps to pixels
        this.sprite.x = Math.round(this.sprite.x);
        this.sprite.y = Math.round(this.sprite.y);
        
        this.initialY = Math.round(y);
        this.isJumping = false;
        this.isCrouching = false;
        this.currentVelocity = 0;
        this.jumpHeight = 0;
        this.isHoldingJump = false;

        // Create animations if they don't exist
        this.createAnimations();
        
        this.setupControls();
        this.setupAnimationListeners();

        // Start running animation
        this.sprite.play(ANIMATIONS.RUN);
    }

    createAnimations() {
        // Check if animations already exist
        if (!this.scene.anims.exists(ANIMATIONS.RUN)) {
            this.scene.anims.create({
                key: ANIMATIONS.RUN,
                frames: Array.from({ length: ANIMATIONS.FRAMES.RUN }, 
                    (_, i) => ({ key: `run-${i + 1}` })),
                frameRate: ANIMATIONS.FRAME_RATE.RUN,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists(ANIMATIONS.JUMP)) {
            this.scene.anims.create({
                key: ANIMATIONS.JUMP,
                frames: Array.from({ length: ANIMATIONS.FRAMES.JUMP }, 
                    (_, i) => ({ key: `jump-${i + 1}` })),
                frameRate: ANIMATIONS.FRAME_RATE.JUMP,
                repeat: 0
            });
        }

        if (!this.scene.anims.exists(ANIMATIONS.CROUCH)) {
            this.scene.anims.create({
                key: ANIMATIONS.CROUCH,
                frames: Array.from({ length: ANIMATIONS.FRAMES.CROUCH }, 
                    (_, i) => ({ key: `crouch-${i + 1}` })),
                frameRate: ANIMATIONS.FRAME_RATE.CROUCH,
                repeat: 0
            });
        }
    }

    setupControls() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) return;

        keyboard.on('keydown-W', () => {
            if (!this.isJumping && !this.isCrouching) {
                this.startJump();
            }
        });

        keyboard.on('keyup-W', () => {
            this.releaseJump();
        });

        keyboard.on('keydown-S', () => {
            if (!this.isJumping && !this.isCrouching) {
                this.startCrouch();
            }
        });

        keyboard.on('keyup-S', () => {
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
        if (this.jumpCooldown) return;
        
        this.isJumping = true;
        this.isHoldingJump = true;
        this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.JUMP_VELOCITY;
        this.sprite.play(ANIMATIONS.JUMP);
        
        // Add a small cooldown to prevent rapid jump spamming
        this.jumpCooldown = true;
        this.scene.time.delayedCall(150, () => {
            this.jumpCooldown = false;
        });
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
        
        // Ensure position remains pixel-perfect
        this.sprite.x = Math.round(this.sprite.x);
        this.sprite.y = Math.round(this.sprite.y);
    }
}