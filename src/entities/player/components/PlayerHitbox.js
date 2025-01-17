export class PlayerHitbox {
    constructor(sprite) {
        this.sprite = sprite;
        this.debug = true;
    }

    configure() {
        try {
            if (this.debug) {
                console.log('[PlayerHitbox] Configuring initial hitbox');
            }
            this.updateForAnimation('run');
        } catch (error) {
            console.error('[PlayerHitbox] Error configuring hitbox:', error);
        }
    }

    updateForAnimation(animKey) {
        const body = this.sprite.body;
        const width = this.sprite.width;
        const height = this.sprite.height;
        
        const config = this.getHitboxConfig(animKey, width, height);
        this.applyConfiguration(config);
        
        if (this.debug) {
            this.logHitboxConfig(animKey, config);
        }
    }

    getHitboxConfig(animKey, width, height) {
        switch(animKey) {
            case 'crouch':
                return {
                    width: width * 0.5,
                    height: height * 0.33,
                    offsetX: width * 0.33,
                    offsetY: height * 0.62
                };
                
            case 'jump':
                return {
                    width: width * 0.35,
                    height: height * 0.55,
                    offsetX: width * 0.35,
                    offsetY: height * 0.3
                };
                
            default: // 'run'
                return {
                    width: width * 0.35,
                    height: height * 0.55,
                    offsetX: width * 0.33,
                    offsetY: height * 0.36
                };
        }
    }

    applyConfiguration(config) {
        const body = this.sprite.body;
        body.setSize(config.width, config.height);
        body.setOffset(config.offsetX, config.offsetY);
    }

    logHitboxConfig(animKey, config) {
        console.log(`[PlayerHitbox] Updated hitbox for ${animKey}:`, {
            width: config.width,
            height: config.height,
            offsetX: config.offsetX,
            offsetY: config.offsetY,
            finalBody: {
                width: this.sprite.body.width,
                height: this.sprite.body.height,
                offsetX: this.sprite.body.offset.x,
                offsetY: this.sprite.body.offset.y
            }
        });
    }
}