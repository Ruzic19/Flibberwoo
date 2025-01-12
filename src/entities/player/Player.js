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
        this.controls = new PlayerControls(scene, {
            onJumpStart: () => this.startJump(),
            onJumpEnd: () => this.releaseJump(),
            onCrouchStart: () => this.startCrouch(),
            onCrouchEnd: () => this.endCrouch()
        });

        this.setup();
    }

    setup() {
        this.animations.create();
        this.controls.setup();
        this.animations.setupListeners(
            this.sprite,
            () => this.onJumpAnimationComplete(),
            () => this.onCrouchAnimationComplete()
        );
        this.sprite.playAnimation(ANIMATIONS.RUN);
    }

    startJump() {
        if (!this.state.canPerformJump() || this.state.isInJump() || this.state.isInCrouch()) {
            return;
        }
        
        this.state.setJumping(true);
        this.state.setCanJump(false);
        this.physics.startJump();
        this.sprite.playAnimation(ANIMATIONS.JUMP);
    }

    releaseJump() {
        if (this.state.isInJump()) {
            this.physics.releaseJump();
        }
    }

    land() {
        this.sprite.setY(this.initialY);
        this.state.setJumping(false);
        this.physics.reset();

        if (!this.controls.isJumpKeyPressed()) {
            this.state.setCanJump(true);
        } else {
            const checkKeyUp = this.scene.time.addEvent({
                delay: 10,
                callback: () => {
                    if (!this.controls.isJumpKeyPressed()) {
                        this.state.setCanJump(true);
                        checkKeyUp.remove();
                    }
                },
                loop: true
            });
        }

        if (!this.state.isInCrouch()) {
            this.sprite.playAnimation(ANIMATIONS.RUN);
        }
    }

    startCrouch() {
        if (!this.state.canPerformCrouch() || this.state.isInCrouch() || 
            this.state.isInJump() || this.state.getCrouchTimer()) {
            return;
        }
        
        this.state.setCanCrouch(false);
        this.state.setCrouching(true);
        this.sprite.playAnimation(ANIMATIONS.CROUCH);

        const crouchTimer = this.scene.time.delayedCall(700, () => {
            this.endCrouch();
        });
        this.state.setCrouchTimer(crouchTimer);
    }

    endCrouch() {
        if (!this.state.isInCrouch()) return;
        
        this.state.setCrouching(false);
        const timer = this.state.getCrouchTimer();
        if (timer) {
            timer.remove();
            this.state.setCrouchTimer(null);
        }
        
        if (!this.state.isInJump()) {
            this.sprite.playAnimation(ANIMATIONS.RUN);
        }

        if (!this.controls.isCrouchKeyPressed()) {
            this.state.setCanCrouch(true);
        } else {
            const checkKeyUp = this.scene.time.addEvent({
                delay: 10,
                callback: () => {
                    if (!this.controls.isCrouchKeyPressed()) {
                        this.state.setCanCrouch(true);
                        checkKeyUp.remove();
                    }
                },
                loop: true
            });
        }
    }

    onJumpAnimationComplete() {
        if (!this.state.isInCrouch()) {
            this.sprite.playAnimation(ANIMATIONS.RUN);
        }
    }

    onCrouchAnimationComplete() {
        // Handle crouch animation completion if needed
    }

    update() {
        if (this.state.isInJump()) {
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