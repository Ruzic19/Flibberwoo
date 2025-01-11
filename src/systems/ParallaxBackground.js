// src/systems/ParallaxBackground.js
import { GAME_CONFIG } from '../config/gameConfig';

export default class ParallaxBackground {
    debug(message, data = null) {
        console.log(`[ParallaxBackground] ${message}`, data || '');
    }

    constructor(scene, layerInfo) {
        this.scene = scene;
        this.layers = [];
        this.createLayers(layerInfo);
    }

    createLayers(layerInfo) {
        this.debug('Starting layer creation');
        this.debug('Layer info received:', layerInfo);
        
        const scale = this.scene.cameras.main.width / GAME_CONFIG.ORIGINAL_WIDTH;
        this.debug('Calculated scale:', scale);

        [...layerInfo].reverse().forEach((layerData, index) => {
            this.debug(`Checking texture for ${layerData.key}`);
            if (this.scene.textures.exists(layerData.key)) {
                this.debug(`Texture exists for ${layerData.key}`);
                try {
                    for (let i = 0; i < 2; i++) {
                        const x = i * GAME_CONFIG.ORIGINAL_WIDTH * scale;
                        const sprite = this.scene.add.sprite(
                            x, 
                            -GAME_CONFIG.VERTICAL_OFFSET, 
                            layerData.key
                        )
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        const speed = (index / (layerInfo.length - 1)) * 0.5;
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        
                        this.layers.push(sprite);
                    }
                } catch (error) {
                    console.error(`Error creating ${layerData.key}:`, error);
                }
            } else {
                this.debug(`Texture does not exist for ${layerData.key}`);
            }
        });
    }

    update() {
        const baseSpeed = GAME_CONFIG.SCROLL_SPEED.BASE;
        
        for (let i = 0; i < this.layers.length; i += 2) {
            const sprite1 = this.layers[i];
            const sprite2 = this.layers[i + 1];
            
            sprite1.x -= baseSpeed * sprite1.scrollSpeed;
            sprite2.x -= baseSpeed * sprite2.scrollSpeed;
            
            const width = sprite1.width * sprite1.scaleX;
            
            if (sprite1.x <= -width) {
                sprite1.x = sprite2.x + width;
            }
            if (sprite2.x <= -width) {
                sprite2.x = sprite1.x + width;
            }
        }
    }
}