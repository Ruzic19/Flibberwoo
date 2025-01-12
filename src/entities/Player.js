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

        console.log('Player initialized:', {
            initialY: this.initialY,
            x: this.sprite.x,
            y: this.sprite.y
        });

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
            console.log('W key released');
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
            console.log('Animation complete:', animation.key);
            if (animation.key === ANIMATIONS.JUMP) {
                if (!this.isCrouching) {
                    this.sprite.play(ANIMATIONS.RUN);
                }
            }
        });
    }

    startJump() {
        if (this.jumpCooldown || this.isJumping) {
            console.log('Jump prevented:', {
                hasCooldown: this.jumpCooldown,
                isJumping: this.isJumping
            });
            return;
        }
        
        console.log('Starting jump from:', {
            y: Math.round(this.sprite.y),
            initialY: Math.round(this.initialY)
        });
        
        this.isJumping = true;
        this.isHoldingJump = true;
        this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.JUMP_VELOCITY;
        this.jumpHeight = 0;
        this.sprite.play(ANIMATIONS.JUMP);
        
        // Add a small cooldown to prevent rapid jump spamming
        this.jumpCooldown = true;
        this.scene.time.delayedCall(150, () => {
            this.jumpCooldown = false;
        });
    }

    releaseJump() {
        console.log('Release jump called:', {
            isJumping: this.isJumping,
            isHolding: this.isHoldingJump,
            velocity: this.currentVelocity
        });
        
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
        if (!this.isJumping) return;

        // Calculate current height before applying velocity
        this.jumpHeight = this.initialY - this.sprite.y;

        console.log('Jump State:', {
            currentY: Math.round(this.sprite.y),
            initialY: Math.round(this.initialY),
            jumpHeight: Math.round(this.jumpHeight),
            velocity: Math.round(this.currentVelocity * 100) / 100,
            isHolding: this.isHoldingJump,
            isJumping: this.isJumping
        });

        // Determine if we should start falling
        if (this.jumpHeight >= GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT) {
            console.log('Max height reached, forcing fall');
            // Force falling when max height is reached, regardless of key state
            this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.FALL_VELOCITY;
            this.isHoldingJump = false;  // Force release the jump when max height reached
        } else if (!this.isHoldingJump) {
            console.log('Jump released, starting fall');
            // Start falling if jump key was released
            this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.FALL_VELOCITY;
        }
        
        // Add gravity effect
        this.currentVelocity += GAME_CONFIG.PLAYER.PHYSICS.GRAVITY;
        
        // Update position
        let previousY = this.sprite.y;
        this.sprite.y += this.currentVelocity;
        
        console.log('Position Update:', {
            previousY: Math.round(previousY),
            newY: Math.round(this.sprite.y),
            deltaY: Math.round((this.sprite.y - previousY) * 100) / 100
        });
        
        // Cap at max height
        if (this.jumpHeight > GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT) {
            console.log('Capping at max height');
            this.sprite.y = this.initialY - GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT;
            this.currentVelocity = Math.abs(GAME_CONFIG.PLAYER.PHYSICS.JUMP_VELOCITY);
        }

        // Check for landing
        if (this.currentVelocity > 0 && this.sprite.y >= this.initialY) {
            console.log('Landing triggered:', {
                finalY: Math.round(this.sprite.y),
                targetY: Math.round(this.initialY)
            });
            this.land();
        }
    }

    land() {
        console.log('Landing executed - Resetting position:', {
            fromY: Math.round(this.sprite.y),
            toY: Math.round(this.initialY)
        });
        
        this.sprite.y = this.initialY;
        this.isJumping = false;
        this.isHoldingJump = false;
        this.currentVelocity = 0;
        this.jumpHeight = 0;
        
        console.log('Landing complete - Final state:', {
            y: Math.round(this.sprite.y),
            initialY: Math.round(this.initialY),
            isJumping: this.isJumping,
            isHolding: this.isHoldingJump
        });

        if (!this.isCrouching) {
            this.sprite.play(ANIMATIONS.RUN);
        }
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