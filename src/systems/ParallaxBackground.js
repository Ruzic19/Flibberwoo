export default class ParallaxBackground {
    constructor(scene, layerInfo) {
        this.scene = scene;
        this.layers = [];
        this.debug = true;
        this.createLayers(layerInfo);
    }

    createLayers(layerInfo) {
        const scale = this.scene.cameras.main.width / 928; // Use hardcoded width to avoid reference error

        [...layerInfo].reverse().forEach((layerData, index) => {
            if (this.scene.textures.exists(layerData.key)) {
                try {
                    for (let i = 0; i < 2; i++) {
                        const x = i * 928 * scale; // Use hardcoded width
                        const y = Math.round(-300); // Use hardcoded offset
                        
                        const sprite = this.scene.add.sprite(x, y, layerData.key)
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        sprite.texture.setFilter(Phaser.Textures.LINEAR);
                        
                        // Calculate parallax effect (closer layers move faster)
                        const speed = index / (layerInfo.length - 1);
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        sprite.scrollX = 0;
                        
                        this.layers.push(sprite);
                    }
                } catch (error) {
                    console.error(`[ParallaxBackground] Error creating layer ${layerData.key}:`, error);
                }
            }
        });
    }

    update() {
        let baseSpeed = 3; // Default speed

        try {
            if (this.scene.difficultyManager) {
                baseSpeed = this.scene.difficultyManager.getCurrentSpeed();
            }
        } catch (error) {
            console.warn('[ParallaxBackground] Using default speed');
        }

        // Update each layer's position
        for (let i = 0; i < this.layers.length; i += 2) {
            const sprite1 = this.layers[i];
            const sprite2 = this.layers[i + 1];
            
            if (!sprite1 || !sprite2) continue;

            try {
                sprite1.scrollX += baseSpeed * sprite1.scrollSpeed;
                sprite2.scrollX += baseSpeed * sprite2.scrollSpeed;
                
                sprite1.x = Math.round(sprite1.startX - sprite1.scrollX);
                sprite2.x = Math.round(sprite2.startX - sprite2.scrollX);
                
                const width = sprite1.width * sprite1.scaleX;
                
                // Reset positions when sprites go off screen
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
            } catch (error) {
                console.error('[ParallaxBackground] Error updating sprites:', error);
            }
        }
    }
}