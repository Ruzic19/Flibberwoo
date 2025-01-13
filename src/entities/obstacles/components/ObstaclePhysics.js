export class ObstaclePhysics {
    constructor(sprite, scene) {
        this.sprite = sprite;
        this.scene = scene;
        this.debug = false;
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
        this.sprite.body.setVelocityX(velocity);
        
        if (this.debug) {
            console.log('[ObstaclePhysics] Velocity set:', velocity);
        }
    }

    enable() {
        this.sprite.body.setEnable(true);
        
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
}