import { ANIMATIONS } from '../../constants/AnimationKeys';

export class PlayerAnimations {
    constructor(scene) {
        this.scene = scene;
    }

    create() {
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

    setupListeners(sprite, onJumpComplete, onCrouchComplete) {
        sprite.on('animationcomplete', (animation) => {
            if (animation.key === ANIMATIONS.JUMP) {
                onJumpComplete();
            } else if (animation.key === ANIMATIONS.CROUCH) {
                onCrouchComplete();
            }
        });
    }
}