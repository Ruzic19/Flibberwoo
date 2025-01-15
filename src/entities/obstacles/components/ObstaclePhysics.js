export class ObstaclePhysics {
    constructor(sprite, scene) {
        this.sprite = sprite;
        this.scene = scene;
        this.debug = false;
        this.lastUpdateTime = performance.now();
    }

    initialize() {
        this.scene.physics.add.existing(this.sprite, false);
        this.sprite.body.setAllowGravity(false);
        
        if (this.debug) {
            console.log('[ObstaclePhysics] Physics initialized:', {
                body: this.sprite.body,
                gravity: this.sprite.body.allowGravity
            });
        }
    }

    setVelocity(velocity) {
        // Store the desired velocity
        this.desiredVelocity = velocity;
        
        // Calculate frame-rate independent velocity
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);
        this.lastUpdateTime = currentTime;
        
        const adjustedVelocity = velocity * deltaTime;
        this.sprite.body.setVelocityX(adjustedVelocity);
        
        if (this.debug) {
            console.log('[ObstaclePhysics] Velocity set:', {
                desired: velocity,
                adjusted: adjustedVelocity,
                deltaTime
            });
        }
    }

    enable() {
        this.sprite.body.setEnable(true);
        this.lastUpdateTime = performance.now();
        
        if (this.debug) {
            console.log('[ObstaclePhysics] Physics enabled');
        }
    }

    disable() {
        this.sprite.body.setEnable(false);
        
        if (this.debug) {
            console.log('[ObstaclePhysics] Physics disabled');
        }
    }

    getBody() {
        return this.sprite.body;
    }

    update() {
        if (!this.sprite.body.enable || !this.desiredVelocity) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);
        this.lastUpdateTime = currentTime;
        
        // Update velocity with new deltaTime
        const adjustedVelocity = this.desiredVelocity * deltaTime;
        this.sprite.body.setVelocityX(adjustedVelocity);
    }
}