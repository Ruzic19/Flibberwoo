// src/systems/ScoringSystem.js
import { logger } from '../utils/LogManager';

export class ScoringSystem {
    constructor(scene) {
        this.scene = scene;
        this.moduleName = 'ScoringSystem';
        this.score = 0;
        this.isFrozen = false;
        this.distanceMultiplier = 0.1; // Points per pixel traveled
        
        // Enable logging for this module
        logger.enableModule(this.moduleName);
        logger.info(this.moduleName, 'Initializing scoring system', {
            initialScore: this.score,
            multiplier: this.distanceMultiplier
        });

        // UI elements
        this.scoreText = null;
        this.setupUI();
    }
    
    setupUI() {
        try {
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

            logger.debug(this.moduleName, 'Score UI initialized', {
                position: {
                    x: this.scene.cameras.main.width / 2,
                    y: 40
                },
                style: {
                    fontSize: '32px',
                    depth: 1000
                }
            });
        } catch (error) {
            logger.error(this.moduleName, 'Failed to setup score UI', {
                error: error.message,
                stack: error.stack
            });
        }
    }
    
    update() {
        if (this.isFrozen) {
            logger.debug(this.moduleName, 'Score update skipped - system frozen');
            return;
        }
        
        // Update score based on distance traveled
        if (this.scene.background && this.scene.background.getLayer1PixelsPerFrame) {
            const pixelsPerFrame = this.scene.background.getLayer1PixelsPerFrame();
            const previousScore = this.score;
            this.score += pixelsPerFrame * this.distanceMultiplier;
            
            logger.debug(this.moduleName, 'Score updated', {
                pixelsTraveled: pixelsPerFrame,
                scoreIncrement: pixelsPerFrame * this.distanceMultiplier,
                previousScore,
                newScore: this.score
            });

            this.updateUI();
        } else {
            logger.warn(this.moduleName, 'Could not update score - background reference or method missing');
        }
    }
    
    updateUI() {
        try {
            const displayScore = Math.floor(this.score);
            this.scoreText.setText(`Score: ${displayScore}`);
            
            // Log significant score milestones
            if (Math.floor(this.score / 1000) > Math.floor((this.score - 1) / 1000)) {
                logger.info(this.moduleName, 'Score milestone reached', {
                    milestone: Math.floor(this.score / 1000) * 1000,
                    totalScore: displayScore
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Failed to update score display', {
                error: error.message,
                currentScore: this.score
            });
        }
    }
    
    freeze() {
        this.isFrozen = true;
        logger.info(this.moduleName, 'Scoring system frozen', {
            finalScore: Math.floor(this.score)
        });
    }
    
    reset() {
        const previousScore = this.score;
        this.score = 0;
        this.isFrozen = false;
        
        logger.info(this.moduleName, 'Scoring system reset', {
            previousScore,
            newScore: this.score
        });
        
        this.updateUI();
    }
    
    getCurrentScore() {
        return Math.floor(this.score);
    }
}