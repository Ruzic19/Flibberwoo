import { GAME_CONFIG } from '../../config/gameConfig';
import { ANIMATIONS } from '../../constants/AnimationKeys';
import { PlayerSprite } from './PlayerSprite';
import { PlayerAnimations } from './PlayerAnimations';
import { PlayerControls } from './PlayerControls';
import { PlayerState } from './states/PlayerState';
import { PlayerPhysics } from './PlayerPhysics';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initialY = Math.round(y);
        
        this.sprite = new PlayerSprite(scene, x, y, GAME_CONFIG.PLAYER.SCALE);
        this.animations = new PlayerAnimations(scene);
        this.state = new PlayerState();
        this.physics = new PlayerPhysics(GAME_CONFIG.PLAYER.PHYSICS);
        
        // Control state flags
        this.isJumping = false;
        this.isCrouching = false;
        this.crouchTimer = null;
        this.canJump = true;
        this.jumpKeyPressed = false;

        this.setup();
    }

    setup() {
        this.animations.create();
        this.setupControls();
        this.animations.setupListeners(
            this.sprite,
            () => this.onJumpAnimationComplete(),
            () => this.onCrouchAnimationComplete()
        );
        this.sprite.playAnimation(ANIMATIONS.RUN);
    }

    setupControls() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) return;

        keyboard.on('keydown-W', () => {
            // Check both isCrouching and crouchTimer to prevent jump during crouch animation
            if (!this.jumpKeyPressed && this.canJump && !this.isJumping && 
                !this.isCrouching && !this.crouchTimer) {
                this.jumpKeyPressed = true;
                this.startJump();
            }
        });

        keyboard.on('keyup-W', () => {
            this.jumpKeyPressed = false;
            this.releaseJump();
        });

        keyboard.on('keydown-S', () => {
            // Only start a new crouch if we're not already crouching and not jumping
            if (!this.isCrouching && !this.isJumping && !this.crouchTimer) {
                this.startCrouch();
            }
        });
    }

    startJump() {
        if (this.isJumping) return;
        
        this.isJumping = true;
        this.canJump = false;
        this.physics.startJump();
        this.sprite.playAnimation(ANIMATIONS.JUMP);
    }

    releaseJump() {
        if (this.isJumping) {
            this.physics.releaseJump();
        }
    }

    startCrouch() {
        // If already crouching or a crouch timer exists, ignore the request
        if (this.isCrouching || this.crouchTimer) return;
        
        this.isCrouching = true;
        this.sprite.playAnimation(ANIMATIONS.CROUCH);

        // Set timer for automatic crouch end after 0.7 seconds
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
            this.sprite.playAnimation(ANIMATIONS.RUN);
        }
    }

    land() {
        this.sprite.setY(this.initialY);
        this.isJumping = false;
        this.physics.reset();

        // Only allow new jump when the jump key isn't being held
        if (!this.jumpKeyPressed) {
            this.canJump = true;
        } else {
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

        if (!this.isCrouching) {
            this.sprite.playAnimation(ANIMATIONS.RUN);
        }
    }

    onJumpAnimationComplete() {
        if (!this.isCrouching) {
            this.sprite.playAnimation(ANIMATIONS.RUN);
        }
    }

    onCrouchAnimationComplete() {
        // Handle crouch animation completion if needed
    }

    update() {
        if (this.isJumping) {
            const { newY, shouldLand } = this.physics.updateJump(
                this.sprite.getY(), 
                this.initialY
            );
            
            this.sprite.setY(newY);
            
            if (shouldLand) {
                this.land();
            }
        }
    }
}