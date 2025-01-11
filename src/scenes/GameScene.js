import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.layers = [];
        this.player = null;
        this.cursors = null;
        this.isJumping = false;
        this.isCrouching = false;
        this.jumpVelocity = -8;
        this.gravity = 0.3;            // Reduced gravity for more "floaty" feel
        this.currentVelocity = 0;
        this.initialY = 0;
        this.jumpHeight = 0;
        this.maxJumpHeight = 150;      // Increased max height
        this.isHoldingJump = false;
        this.holdJumpForce = -0.5;     // Additional upward force while holding
    }

    preload() {
        this.load.baseURL = '/';
        this.load.crossOrigin = 'anonymous';

        // Load background layers
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

        // Load player sprites
        for (let i = 1; i <= 6; i++) {
            this.load.image(`run-${i}`, `assets/player_sprites/run-${i}.png`);
        }
        for (let i = 1; i <= 2; i++) {
            this.load.image(`jump-${i}`, `assets/player_sprites/jump-${i}.png`);
            this.load.image(`crouch-${i}`, `assets/player_sprites/crouch-${i}.png`);
        }
    }

    createPlayerAnimations() {
        // Running animation
        this.anims.create({
            key: 'run',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `run-${i + 1}` })),
            frameRate: 10,
            repeat: -1
        });

        // Jumping animation
        this.anims.create({
            key: 'jump',
            frames: Array.from({ length: 2 }, (_, i) => ({ key: `jump-${i + 1}` })),
            frameRate: 5,
            repeat: 0
        });

        // Crouching animation
        this.anims.create({
            key: 'crouch',
            frames: Array.from({ length: 2 }, (_, i) => ({ key: `crouch-${i + 1}` })),
            frameRate: 5,
            repeat: 0
        });
    }

    create() {
        console.log('Create function started');
        
        // Original image dimensions
        const ORIGINAL_WIDTH = 928;
        const ORIGINAL_HEIGHT = 793;
        const HEIGHT_TO_SHOW = 600;
        const scale = this.cameras.main.width / ORIGINAL_WIDTH;
        const verticalOffset = 300;
        
        // Create background layers
        [...this.layerInfo].reverse().forEach((layerData, index) => {
            if (this.textures.exists(layerData.key)) {
                try {
                    for (let i = 0; i < 2; i++) {
                        const x = i * ORIGINAL_WIDTH * scale;
                        const sprite = this.add.sprite(x, -verticalOffset, layerData.key)
                            .setOrigin(0, 0)
                            .setScale(scale)
                            .setDepth(index);
                        
                        const speed = (index / (this.layerInfo.length - 1)) * 0.5;
                        sprite.scrollSpeed = speed;
                        sprite.startX = x;
                        
                        this.layers.push(sprite);
                    }
                } catch (error) {
                    console.error(`Error creating ${layerData.key}:`, error);
                }
            }
        });

        // Create player animations
        this.createPlayerAnimations();

        // Create player sprite
        this.player = this.add.sprite(
            this.cameras.main.width * 0.2,
            this.cameras.main.height * 0.9,
            'run-1'
        )
        .setDepth(this.layerInfo.length)
        .setScale(2)
        .setOrigin(0.5, 0.5);

        // Store initial Y position
        this.initialY = this.player.y;

        // Set pixel-art friendly scaling
        this.player.texture.setFilter(Phaser.Textures.NEAREST);

        // Start running animation
        this.player.play('run');

        // Set up keyboard input
        this.input.keyboard.on('keydown-W', () => {
            if (!this.isJumping && !this.isCrouching) {
                this.isJumping = true;
                this.isHoldingJump = true;
                this.currentVelocity = this.jumpVelocity;
                this.player.play('jump');
            }
        });

        this.input.keyboard.on('keyup-W', () => {
            this.isHoldingJump = false;
            if (this.isJumping && this.currentVelocity < 0) {
                // Cut the upward velocity when releasing the key
                this.currentVelocity = this.currentVelocity / 2;
            }
        });

        this.input.keyboard.on('keydown-S', () => {
            if (!this.isJumping && !this.isCrouching) {
                this.isCrouching = true;
                this.player.play('crouch');
            }
        });

        this.input.keyboard.on('keyup-S', () => {
            if (this.isCrouching) {
                this.isCrouching = false;
                this.player.play('run');
            }
        });

        // Listen for animation complete
        this.player.on('animationcomplete', (animation) => {
            if (animation.key === 'jump') {
                this.isJumping = false;
                if (!this.isCrouching) {
                    this.player.play('run');
                }
            }
        });
    }

    update() {
        const baseSpeed = 2;
        
        // Update background layers
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

        // Handle jumping physics
        if (this.isJumping) {
            // Add extra force while holding jump button and moving upward
            if (this.isHoldingJump && this.currentVelocity < 0) {
                // Smoother upward force near the peak
                let force = this.holdJumpForce;
                if (Math.abs(this.currentVelocity) < 2) {
                    force *= 0.5; // Reduce the extra force near peak
                }
                this.currentVelocity += force;
            }
            
            // Update position based on velocity
            this.player.y += this.currentVelocity;
            
            // Apply gravity
            this.currentVelocity += this.gravity;
            
            // Track jump height from initial position
            this.jumpHeight = this.initialY - this.player.y;
            
            // Limit maximum jump height
            if (this.jumpHeight > this.maxJumpHeight) {
                this.player.y = this.initialY - this.maxJumpHeight;
                this.currentVelocity = 0;
            }

            // Check for landing
            if (this.player.y >= this.initialY) {
                this.player.y = this.initialY;
                this.isJumping = false;
                this.currentVelocity = 0;
                this.jumpHeight = 0;
                this.player.play('run');
            }
        }
    }
}