import { ANIMATIONS } from '../constants/AnimationKeys';

export default class AssetLoader {
    static loadPlayerSprites(scene) {
        // Load running sprites
        for (let i = 1; i <= ANIMATIONS.FRAMES.RUN; i++) {
            scene.load.image(`run-${i}`, `assets/player_sprites/run-${i}.png`);
        }
        
        // Load jumping sprites
        for (let i = 1; i <= ANIMATIONS.FRAMES.JUMP; i++) {
            scene.load.image(`jump-${i}`, `assets/player_sprites/jump-${i}.png`);
        }
        
        // Load crouching sprites
        for (let i = 1; i <= ANIMATIONS.FRAMES.CROUCH; i++) {
            scene.load.image(`crouch-${i}`, `assets/player_sprites/crouch-${i}.png`);
        }
    }

    static createPlayerAnimations(scene) {
        // Running animation
        scene.anims.create({
            key: ANIMATIONS.RUN,
            frames: Array.from({ length: ANIMATIONS.FRAMES.RUN }, 
                (_, i) => ({ key: `run-${i + 1}` })),
            frameRate: ANIMATIONS.FRAME_RATE.RUN,
            repeat: -1
        });

        // Jumping animation
        scene.anims.create({
            key: ANIMATIONS.JUMP,
            frames: Array.from({ length: ANIMATIONS.FRAMES.JUMP }, 
                (_, i) => ({ key: `jump-${i + 1}` })),
            frameRate: ANIMATIONS.FRAME_RATE.JUMP,
            repeat: 0
        });

        // Crouching animation
        scene.anims.create({
            key: ANIMATIONS.CROUCH,
            frames: Array.from({ length: ANIMATIONS.FRAMES.CROUCH }, 
                (_, i) => ({ key: `crouch-${i + 1}` })),
            frameRate: ANIMATIONS.FRAME_RATE.CROUCH,
            repeat: 0
        });
    }
}