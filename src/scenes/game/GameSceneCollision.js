export class GameSceneCollision {
    constructor(scene) {
        this.scene = scene;
        this.debug = false;
    }

    debugLog(message, data = null) {
        if (this.debug) {
            console.log(`[GameSceneCollision] ${message}`, data || '');
        }
    }

    setupCollision(player, obstacleManager) {
        this.debugLog('Setting up collision detection');

        const collider = this.scene.physics.add.collider(
            player.sprite.sprite,
            obstacleManager.getActiveObstacles(),
            this.handleCollision.bind(this),
            this.checkCollision.bind(this),
            this
        );

        if (collider.showDebug) {
            collider.showDebug = false;
        }
    }

    checkCollision(playerSprite, obstacleSprite) {
        const playerBody = playerSprite.body;
        const obstacleBody = obstacleSprite.body;

        const collision = Phaser.Geom.Rectangle.Overlaps(
            playerBody.getBounds(),
            obstacleBody.getBounds()
        );

        if (collision) {
            const overlap = Phaser.Geom.Rectangle.Overlap(
                playerBody.getBounds(),
                obstacleBody.getBounds()
            );

            const overlapThreshold = 0.2;
            const overlapPercent = overlap / (playerBody.width * playerBody.height);
            
            return overlapPercent > overlapThreshold;
        }

        return false;
    }

    handleCollision() {
        this.scene.cameras.main.shake(200, 0.01);
        
        this.scene.time.delayedCall(300, () => {
            this.scene.scene.restart();
        });
    }
}