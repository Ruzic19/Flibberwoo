// src/entities/obstacles/states/ObstacleState.js
import { logger } from '../../../utils/LogManager';
import { debugOverlay } from '../../../debug/DebugOverlay';

export class ObstacleState {
    constructor() {
        this.moduleName = 'ObstacleState';
        
        // Enable debug for this module through DebugOverlay
        debugOverlay.setModuleDebug(this.moduleName, true);
        
        // Initialize state properties
        this.active = false;
        this.visible = false;
        this.position = { x: 0, y: 0 };
        this.velocity = 0;
        this.lastStateChange = null;
        this.stateHistory = [];
        
        logger.info(this.moduleName, 'Initializing obstacle state manager');
    }

    activate(x, y, velocity) {
        try {
            const previousState = this.getStateSnapshot();
            
            this.active = true;
            this.visible = true;
            this.position = { x, y };
            this.velocity = velocity;
            this.lastStateChange = Date.now();
            
            // Record state change in history
            this.recordStateChange('activate', previousState);

            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Obstacle activated', {
                    position: this.position,
                    velocity: this.velocity,
                    previousState
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error during obstacle activation', {
                error: error.message,
                attempted: { x, y, velocity }
            });
            throw error;
        }
    }

    deactivate() {
        try {
            const previousState = this.getStateSnapshot();
            
            this.active = false;
            this.visible = false;
            this.velocity = 0;
            this.lastStateChange = Date.now();
            
            // Record state change in history
            this.recordStateChange('deactivate', previousState);

            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'Obstacle deactivated', {
                    previousState,
                    finalPosition: { ...this.position }
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error during obstacle deactivation', {
                error: error.message,
                currentState: this.getStateSnapshot()
            });
        }
    }

    isActive() {
        return this.active;
    }

    getPosition() {
        return { ...this.position };
    }

    getVelocity() {
        return this.velocity;
    }

    getStateSnapshot() {
        return {
            active: this.active,
            visible: this.visible,
            position: { ...this.position },
            velocity: this.velocity,
            timestamp: Date.now()
        };
    }

    recordStateChange(action, previousState) {
        try {
            const stateChange = {
                action,
                timestamp: Date.now(),
                previousState,
                newState: this.getStateSnapshot()
            };
            
            this.stateHistory.push(stateChange);
            
            // Keep only the last 10 state changes
            if (this.stateHistory.length > 10) {
                this.stateHistory.shift();
            }

            if (debugOverlay.isDebugEnabled(this.moduleName)) {
                logger.debug(this.moduleName, 'State change recorded', {
                    action,
                    stateChange,
                    historyLength: this.stateHistory.length
                });
            }
        } catch (error) {
            logger.error(this.moduleName, 'Error recording state change', {
                error: error.message,
                action,
                previousState
            });
        }
    }

    getStateHistory() {
        return [...this.stateHistory];
    }

    clearStateHistory() {
        try {
            const previousLength = this.stateHistory.length;
            this.stateHistory = [];
            
            logger.info(this.moduleName, 'State history cleared', {
                previousLength
            });
        } catch (error) {
            logger.error(this.moduleName, 'Error clearing state history', {
                error: error.message
            });
        }
    }

    getTimeSinceLastStateChange() {
        if (!this.lastStateChange) return null;
        return Date.now() - this.lastStateChange;
    }
}