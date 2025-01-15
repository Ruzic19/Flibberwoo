import { GAME_CONFIG } from '../config/gameConfig';

export default class ParallaxBackground {
    constructor(scene, layerInfo) {
        this.scene = scene;
        this.layers = [];
        this.lastUpdateTime = performance.now();
        console.log('[ParallaxBackground] Starting layer creation');
        this.createLayers(layerInfo);
    }

    createLayers(layerInfo) {
        const scale = this.scene.cameras.main.width / GAME_CONFIG.ORIGINAL_WIDTH;
        console.log('[ParallaxBackground] Scale:', scale);

        [...layerInfo].reverse().forEach((layerData, index) => {
            console.log(`[ParallaxBackground] Creating layer: ${layerData.key} at depth ${index}`);
            if (this.scene.textures.exists(layerData.key)) {
                try {
                    // Create two sprites for each layer with a slight overlap
                    for (let i = 0; i < 2; i++) {
                        const x = i * (GAME_CONFIG.ORIGINAL_WIDTH * scale - 1); // Subtract 1 for overlap
                        const y = Math.round(-GAME_CONFIG.VERTICAL_OFFSET);
                        
                        const sprite = this.scene.add.sprite(x, y, layerData.key)
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        // Use NEAREST filter for pixel-perfect rendering
                        sprite.texture.setFilter(Phaser.Textures.NEAREST);
                        
                        const speed = (index / (layerInfo.length - 1));
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        sprite.scrollX = 0;
                        
                        this.layers.push(sprite);
                    }
                } catch (error) {
                    console.error(`[ParallaxBackground] Error creating ${layerData.key}:`, error);
                }
            }
        });
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);
        this.lastUpdateTime = currentTime;

        const baseSpeed = GAME_CONFIG.SCROLL_SPEED.BASE * deltaTime;
        
        for (let i = 0; i < this.layers.length; i += 2) {
            const sprite1 = this.layers[i];
            const sprite2 = this.layers[i + 1];
            
            sprite1.scrollX += baseSpeed * sprite1.scrollSpeed;
            sprite2.scrollX += baseSpeed * sprite2.scrollSpeed;
            
            // Use floor instead of round for consistent positioning
            sprite1.x = Math.floor(sprite1.startX - sprite1.scrollX);
            sprite2.x = Math.floor(sprite2.startX - sprite2.scrollX);
            
            const width = sprite1.width * sprite1.scaleX;
            
            if (sprite1.x <= -width) {
                sprite1.scrollX = 0;
                // Ensure precise positioning when resetting
                sprite1.x = Math.floor(sprite2.x + width - 1); // Subtract 1 for overlap
                sprite1.startX = sprite1.x;
            }
            if (sprite2.x <= -width) {
                sprite2.scrollX = 0;
                // Ensure precise positioning when resetting
                sprite2.x = Math.floor(sprite1.x + width - 1); // Subtract 1 for overlap
                sprite2.startX = sprite2.x;
            }
        }
    }
}