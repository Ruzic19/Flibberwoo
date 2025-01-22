// src/debug/DebugOverlay.js
export class DebugOverlay {
    static instance = null;
    
    constructor() {
        if (DebugOverlay.instance) {
            return DebugOverlay.instance;
        }
        
        this.debugPanel = null;
        this.moduleToggles = null;
        this.config = {
            GLOBAL: false,
            MODULES: {
                ParallaxBackground: false,
                ObstacleManager: false,
                ObstaclePool: false,
                ObstacleSpawner: false,
                GameOverHandler: false,
                DifficultyManager: false,
                ScoringSystem: false,
                Player: false,
                PlayerSprite: false,
                PlayerAnimations: false,
                PlayerControls: false,
                PlayerHitbox: false,
                GameScene: false,
                GameSceneCollision: false
            },
            LOGS_ENABLED: {} // New object to track log toggles
        };

        // Initialize log toggles for each module
        Object.keys(this.config.MODULES).forEach(module => {
            this.config.LOGS_ENABLED[module] = false;
        });
        
        DebugOverlay.instance = this;
    }

    initialize(game) {
        if (process.env.NODE_ENV !== 'development') return;
        
        this.game = game;
        this.createDebugPanel();
        //this.setupKeyboardShortcuts(); ask CLaude what is this function here?
    }

    createDebugPanel() {
        this.debugPanel = document.createElement('div');
        this.debugPanel.style.position = 'fixed';
        this.debugPanel.style.top = '10px';
        this.debugPanel.style.right = '10px';
        this.debugPanel.style.backgroundColor = 'rgba(0,0,0,0.7)';
        this.debugPanel.style.padding = '10px';
        this.debugPanel.style.color = 'white';
        this.debugPanel.style.zIndex = '1000';
        this.debugPanel.style.maxHeight = '80vh';
        this.debugPanel.style.overflowY = 'auto';
        this.debugPanel.style.borderRadius = '5px';
        this.debugPanel.style.minWidth = '400px';
        
        this.debugPanel.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" id="globalDebug"> Global Debug
                </label>
                <button id="togglePanel" style="margin-bottom: 10px; padding: 5px 10px;">Hide Panel</button>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px;">Debug Logs</h3>
                    <div id="logToggles"></div>
                </div>
                <div style="flex: 1; margin-left: 20px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px;">Visual Debug</h3>
                    <div id="moduleToggles"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.debugPanel);

        this.createGlobalToggle();
        this.createModuleToggles();
        this.setupPanelToggle();
    }

    createGlobalToggle() {
        const globalToggle = document.getElementById('globalDebug');
        globalToggle.checked = this.config.GLOBAL;
        globalToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            this.setGlobalDebug(enabled);
            this.updateAllToggles();
        });
    }

    createModuleToggles() {
        this.moduleToggles = document.getElementById('moduleToggles');
        const logToggles = document.getElementById('logToggles');
        
        Object.keys(this.config.MODULES).forEach(moduleName => {
            // Create visual debug toggle
            const visualLabel = document.createElement('label');
            visualLabel.style.display = 'block';
            visualLabel.style.marginBottom = '5px';
            visualLabel.style.cursor = 'pointer';
            visualLabel.innerHTML = `
                <input type="checkbox" data-module="${moduleName}"> ${moduleName}
            `;
            this.moduleToggles.appendChild(visualLabel);

            // Create log toggle
            const logLabel = document.createElement('label');
            logLabel.style.display = 'block';
            logLabel.style.marginBottom = '5px';
            logLabel.style.cursor = 'pointer';
            logLabel.innerHTML = `
                <input type="checkbox" data-log-module="${moduleName}"> ${moduleName}
            `;
            logToggles.appendChild(logLabel);

            // Setup visual debug checkbox
            const visualCheckbox = visualLabel.querySelector('input');
            visualCheckbox.checked = this.config.MODULES[moduleName];
            visualCheckbox.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.setModuleDebug(moduleName, enabled);
            });

            // Setup log checkbox
            const logCheckbox = logLabel.querySelector('input');
            logCheckbox.checked = this.config.LOGS_ENABLED[moduleName];
            logCheckbox.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.setModuleLogs(moduleName, enabled);
            });
        });
    }

    setupPanelToggle() {
        const togglePanel = document.getElementById('togglePanel');
        let isPanelVisible = true;

        togglePanel.addEventListener('click', () => {
            isPanelVisible = !isPanelVisible;
            const contentDivs = this.debugPanel.querySelectorAll('div[style*="flex"]');
            contentDivs.forEach(div => {
                div.style.display = isPanelVisible ? 'flex' : 'none';
            });
            togglePanel.textContent = isPanelVisible ? 'Hide Panel' : 'Show Panel';
            this.debugPanel.style.backgroundColor = isPanelVisible ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)';
        });
    }

    updateAllToggles() {
        // Update visual debug toggles
        const visualCheckboxes = this.moduleToggles.querySelectorAll('input[type="checkbox"]');
        visualCheckboxes.forEach(checkbox => {
            checkbox.checked = this.config.GLOBAL || this.config.MODULES[checkbox.dataset.module];
        });

        // Update log toggles
        const logCheckboxes = document.querySelectorAll('input[data-log-module]');
        logCheckboxes.forEach(checkbox => {
            const moduleName = checkbox.dataset.logModule;
            checkbox.checked = this.config.GLOBAL || this.config.LOGS_ENABLED[moduleName];
        });
    }

    setModuleDebug(moduleName, enabled) {
        if (this.config.MODULES.hasOwnProperty(moduleName)) {
            this.config.MODULES[moduleName] = enabled;
            this.updateDebugGraphics();
        }
    }

    setModuleLogs(moduleName, enabled) {
        if (this.config.LOGS_ENABLED.hasOwnProperty(moduleName)) {
            this.config.LOGS_ENABLED[moduleName] = enabled;
            // If logs are disabled, mute the module in LogManager
            const logger = window.logger || console;
            if (logger.muteModule && logger.unmuteModule) {
                if (enabled) {
                    logger.unmuteModule(moduleName);
                } else {
                    logger.muteModule(moduleName);
                }
            }
        }
    }

    setGlobalDebug(enabled) {
        this.config.GLOBAL = enabled;
        Object.keys(this.config.MODULES).forEach(module => {
            this.config.MODULES[module] = enabled;
            this.config.LOGS_ENABLED[module] = enabled;
            
            // Update LogManager muting
            const logger = window.logger || console;
            if (logger.muteModule && logger.unmuteModule) {
                if (enabled) {
                    logger.unmuteModule(module);
                } else {
                    logger.muteModule(module);
                }
            }
        });
        this.updateDebugGraphics();
    }

    isDebugEnabled(moduleName) {
        return this.config.GLOBAL || this.config.MODULES[moduleName];
    }

    isLoggingEnabled(moduleName) {
        return this.config.GLOBAL || this.config.LOGS_ENABLED[moduleName];
    }

    updateDebugGraphics() {
        if (!this.game) return;
        
        this.game.scene.scenes.forEach(scene => {
            if (scene.physics && scene.physics.world) {
                this.updateSceneDebug(scene);
            }
        });
    }

    updateSceneDebug(scene) {
        if (scene.physics && scene.physics.world) {
            this.clearDebugGraphics(scene);
            const enabled = this.isDebugEnabled('GameScene');
            scene.physics.world.debugGraphic.visible = enabled;
            scene.physics.world.drawDebug = enabled;

            if (enabled) {
                scene.physics.world.drawDebug = false;
                scene.physics.world.drawDebug = true;
            }
        }
    }

    clearDebugGraphics(scene) {
        if (scene.physics.world.debugGraphic) {
            scene.physics.world.debugGraphic.clear();
        }
    }

    static getInstance() {
        if (!DebugOverlay.instance) {
            DebugOverlay.instance = new DebugOverlay();
        }
        return DebugOverlay.instance;
    }
}

export const debugOverlay = DebugOverlay.getInstance();