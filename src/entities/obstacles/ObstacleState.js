export class ObstacleState {
    constructor() {
        this.active = false;
        this.visible = false;
        this.position = { x: 0, y: 0 };
        this.velocity = 0;
        this.debug = false;
    }

    activate(x, y, velocity) {
        this.active = true;
        this.visible = true;
        this.position = { x, y };
        this.velocity = velocity;

        if (this.debug) {
            console.log('[ObstacleState] Activated:', {
                position: this.position,
                velocity: this.velocity
            });
        }
    }

    deactivate() {
        this.active = false;
        this.visible = false;
        this.velocity = 0;

        if (this.debug) {
            console.log('[ObstacleState] Deactivated');
        }
    }

    isActive() {
        return this.active;
    }

    getPosition() {
        return this.position;
    }

    getVelocity() {
        return this.velocity;
    }
}