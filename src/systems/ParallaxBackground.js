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
        console.log('[ParallaxBackground] Physics bodies before layer creation:', 
            this.scene.physics.world.bodies.entries.map(body => ({
                x: body.x,
                y: body.y,
                key: body.gameObject?.texture?.key || 'unknown',
                active: body.gameObject?.active || false
            }))
        );

        [...layerInfo].reverse().forEach((layerData, index) => {
            console.log(`[ParallaxBackground] Creating layer: ${layerData.key} at depth ${index}`);
            if (this.scene.textures.exists(layerData.key)) {
                try {
                    for (let i = 0; i < 2; i++) {
                        const x = i * GAME_CONFIG.ORIGINAL_WIDTH * scale;
                        const y = Math.round(-GAME_CONFIG.VERTICAL_OFFSET);
                        console.log(`[ParallaxBackground] Creating sprite at position:`, { x, y, key: layerData.key });
                        
                        const sprite = this.scene.add.sprite(x, y, layerData.key)
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        sprite.texture.setFilter(Phaser.Textures.LINEAR);
                        
                        const speed = (index / (layerInfo.length - 1));
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        sprite.scrollX = 0;
                        
                        this.layers.push(sprite);
                    }
                } catch (error) {
                    console.error(`[ParallaxBackground] Error creating ${layerData.key}:`, error);
                }
            } else {
                console.warn(`[ParallaxBackground] Texture not found: ${layerData.key}`);
            }
        });
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60); // Normalize to 60 FPS
        this.lastUpdateTime = currentTime;

        const baseSpeed = GAME_CONFIG.SCROLL_SPEED.BASE * deltaTime;
        
        for (let i = 0; i < this.layers.length; i += 2) {
            const sprite1 = this.layers[i];
            const sprite2 = this.layers[i + 1];
            
            sprite1.scrollX += baseSpeed * sprite1.scrollSpeed;
            sprite2.scrollX += baseSpeed * sprite2.scrollSpeed;
            
            sprite1.x = Math.round(sprite1.startX - sprite1.scrollX);
            sprite2.x = Math.round(sprite2.startX - sprite2.scrollX);
            
            const width = sprite1.width * sprite1.scaleX;
            
            if (sprite1.x <= -width) {
                sprite1.scrollX = 0;
                sprite1.x = sprite2.x + width;
                sprite1.startX = sprite1.x;
            }
            if (sprite2.x <= -width) {
                sprite2.scrollX = 0;
                sprite2.x = sprite1.x + width;
                sprite2.startX = sprite2.x;
            }
        }
    }
}