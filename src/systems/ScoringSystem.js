// src/systems/ScoringSystem.js
export class ScoringSystem {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.isFrozen = false;
        this.distanceMultiplier = 0.1; // Points per pixel traveled
        
        // UI elements
        this.scoreText = null;
        this.setupUI();
    }
    
    setupUI() {
        // Create score display in top-center
        this.scoreText = this.scene.add.text(
            this.scene.cameras.main.width / 2, 
            40, 
            'Score: 0', 
            {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
    }
    
    update() {
        if (this.isFrozen) return;
        
        // Update score based on distance traveled
        if (this.scene.background && this.scene.background.getLayer1PixelsPerFrame) {
            const pixelsPerFrame = this.scene.background.getLayer1PixelsPerFrame();
            this.score += pixelsPerFrame * this.distanceMultiplier;
            this.updateUI();
        }
    }
    
    updateUI() {
        this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
    }
    
    freeze() {
        this.isFrozen = true;
    }
    
    reset() {
        this.score = 0;
        this.isFrozen = false;
        this.updateUI();
    }
    
    getCurrentScore() {
        return Math.floor(this.score);
    }
}