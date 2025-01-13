export class ObstacleDebugger {
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.isEnabled = false;
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
        this.graphics.clear();
    }

    update(obstacles) {
        if (!this.isEnabled) return;

        this.graphics.clear();
        this.graphics.lineStyle(1, 0x00ff00);

        obstacles.forEach(obstacle => {
            const body = obstacle.body;
            const bounds = body.getBounds();
            
            // Draw hitbox
            this.graphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            
            // Draw velocity vector
            this.graphics.lineStyle(1, 0xff0000);
            this.graphics.lineBetween(
                obstacle.x,
                obstacle.y,
                obstacle.x + body.velocity.x / 10,
                obstacle.y + body.velocity.y / 10
            );
        });
    }

    drawSpawnPoints(spawnConfig) {
        if (!this.isEnabled) return;

        this.graphics.lineStyle(1, 0x0000ff);
        Object.values(spawnConfig.Y_POSITION).forEach(yRatio => {
            const y = this.scene.cameras.main.height * yRatio;
            this.graphics.lineBetween(0, y, this.scene.cameras.main.width, y);
        });
    }
}