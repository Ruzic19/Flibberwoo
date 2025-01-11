import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.layers = [];
    }

    preload() {
        this.load.baseURL = '/';
        this.load.crossOrigin = 'anonymous';

        this.layerInfo = [
            { key: 'bg', file: 'Layer_0000_9.png' },
            { key: 'layer1', file: 'Layer_0001_8.png' },
            { key: 'layer2', file: 'Layer_0002_7.png' },
            { key: 'layer3', file: 'Layer_0003_6.png' },
            { key: 'lights1', file: 'Layer_0004_Lights.png' },
            { key: 'layer5', file: 'Layer_0005_5.png' },
            { key: 'layer6', file: 'Layer_0006_4.png' },
            { key: 'lights2', file: 'Layer_0007_Lights.png' },
            { key: 'layer8', file: 'Layer_0008_3.png' },
            { key: 'layer9', file: 'Layer_0009_2.png' },
            { key: 'layer10', file: 'Layer_0010_1.png' },
            { key: 'fg', file: 'Layer_0011_0.png' }
        ];

        this.layerInfo.forEach(layer => {
            this.load.image(layer.key, `assets/background/${layer.file}`);
        });
    }

    create() {
        console.log('Create function started');
        
        // Original image dimensions
        const ORIGINAL_WIDTH = 928;
        const ORIGINAL_HEIGHT = 793;
        
        // Calculate how much of the height we want to show (adjust this value to show more/less)
        const HEIGHT_TO_SHOW = 600;
        
        // Calculate scaling based on game width
        const scale = this.cameras.main.width / ORIGINAL_WIDTH;
        
        // Calculate visible portion
        const visiblePortion = HEIGHT_TO_SHOW / ORIGINAL_HEIGHT;
        
        // Calculate how much to offset vertically to show more of the bottom
        // Adjust this value to show more bottom/less sky
        const verticalOffset = 300; // Increase to show more bottom, decrease to show more sky
        
        // Create each layer in reverse order
        [...this.layerInfo].reverse().forEach((layerData, index) => {
            if (this.textures.exists(layerData.key)) {
                try {
                    // Create two sprites for infinite scrolling
                    for (let i = 0; i < 2; i++) {
                        const x = i * ORIGINAL_WIDTH * scale;
                        const sprite = this.add.sprite(x, -verticalOffset, layerData.key)
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        // Store scroll speed as a property
                        const speed = (index / (this.layerInfo.length - 1)) * 0.5;
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        
                        this.layers.push(sprite);
                    }
                    
                    console.log(`Created ${layerData.key} with scale ${scale}`);
                } catch (error) {
                    console.error(`Error creating ${layerData.key}:`, error);
                }
            }
        });
    }

    update() {
        const baseSpeed = 2;
        
        // Update each layer's position
        for (let i = 0; i < this.layers.length; i += 2) {
            const sprite1 = this.layers[i];
            const sprite2 = this.layers[i + 1];
            
            // Move sprites
            sprite1.x -= baseSpeed * sprite1.scrollSpeed;
            sprite2.x -= baseSpeed * sprite2.scrollSpeed;
            
            // Reset position when sprite moves off screen
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