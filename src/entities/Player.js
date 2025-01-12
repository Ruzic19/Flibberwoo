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
        this.crouchTimer = null;
        this.canCrouch = true;
        this.crouchKeyPressed = false;
        
        // New jump control flags
        this.canJump = true;
        this.jumpKeyPressed = false;

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
            if (!this.jumpKeyPressed && this.canJump && !this.isJumping && !this.isCrouching) {
                this.jumpKeyPressed = true;
                this.startJump();
            }
        });

        keyboard.on('keyup-W', () => {
            this.jumpKeyPressed = false;
            this.releaseJump();
        });

        keyboard.on('keydown-S', () => {
            if (!this.crouchKeyPressed && this.canCrouch && !this.isJumping && !this.isCrouching) {
                this.crouchKeyPressed = true;
                this.startCrouch();
            }
        });

        keyboard.on('keyup-S', () => {
            this.crouchKeyPressed = false;
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
        if (!this.canJump || this.isJumping) {
            console.log('Jump prevented:', {
                canJump: this.canJump,
                isJumping: this.isJumping
            });
            return;
        }
        
        console.log('Starting jump from:', {
            y: Math.round(this.sprite.y),
            initialY: Math.round(this.initialY)
        });
        
        this.canJump = false;  // Prevent new jump until current one is complete
        this.isJumping = true;
        this.isHoldingJump = true;
        this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.JUMP_VELOCITY;
        this.jumpHeight = 0;
        this.sprite.play(ANIMATIONS.JUMP);
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
        if (!this.canCrouch || this.isCrouching || this.crouchTimer) return;
        
        this.canCrouch = false;
        this.isCrouching = true;
        this.sprite.play(ANIMATIONS.CROUCH);

        this.crouchTimer = this.scene.time.delayedCall(700, () => {
            this.endCrouch();
        });
    }

    endCrouch() {
        if (!this.isCrouching) return;
        
        this.isCrouching = false;
        if (this.crouchTimer) {
            this.crouchTimer.remove();
            this.crouchTimer = null;
        }
        
        if (!this.isJumping) {
            this.sprite.play(ANIMATIONS.RUN);
        }

        if (!this.crouchKeyPressed) {
            this.canCrouch = true;
        } else {
            const checkKeyUp = this.scene.time.addEvent({
                delay: 10,
                callback: () => {
                    if (!this.crouchKeyPressed) {
                        this.canCrouch = true;
                        checkKeyUp.remove();
                    }
                },
                loop: true
            });
        }
    }

    updateJump() {
        if (!this.isJumping) return;

        this.jumpHeight = this.initialY - this.sprite.y;

        console.log('Jump State:', {
            currentY: Math.round(this.sprite.y),
            initialY: Math.round(this.initialY),
            jumpHeight: Math.round(this.jumpHeight),
            velocity: Math.round(this.currentVelocity * 100) / 100,
            isHolding: this.isHoldingJump,
            isJumping: this.isJumping
        });

        if (this.jumpHeight >= GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT) {
            console.log('Max height reached, forcing fall');
            this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.FALL_VELOCITY;
            this.isHoldingJump = false;
        } else if (!this.isHoldingJump) {
            console.log('Jump released, starting fall');
            this.currentVelocity = GAME_CONFIG.PLAYER.PHYSICS.FALL_VELOCITY;
        }
        
        this.currentVelocity += GAME_CONFIG.PLAYER.PHYSICS.GRAVITY;
        
        let previousY = this.sprite.y;
        this.sprite.y += this.currentVelocity;
        
        console.log('Position Update:', {
            previousY: Math.round(previousY),
            newY: Math.round(this.sprite.y),
            deltaY: Math.round((this.sprite.y - previousY) * 100) / 100
        });
        
        if (this.jumpHeight > GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT) {
            console.log('Capping at max height');
            this.sprite.y = this.initialY - GAME_CONFIG.PLAYER.PHYSICS.MAX_JUMP_HEIGHT;
            this.currentVelocity = Math.abs(GAME_CONFIG.PLAYER.PHYSICS.JUMP_VELOCITY);
        }

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
        
        // Only allow new jump when the jump key is not being held
        if (!this.jumpKeyPressed) {
            this.canJump = true;
        } else {
            // If jump key is still held, wait for release
            const checkKeyUp = this.scene.time.addEvent({
                delay: 10,
                callback: () => {
                    if (!this.jumpKeyPressed) {
                        this.canJump = true;
                        checkKeyUp.remove();
                    }
                },
                loop: true
            });
        }
        
        console.log('Landing complete - Final state:', {
            y: Math.round(this.sprite.y),
            initialY: Math.round(this.initialY),
            isJumping: this.isJumping,
            isHolding: this.isHoldingJump,
            canJump: this.canJump
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