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
            }
        };
        
        DebugOverlay.instance = this;
    }

    initialize(game) {
        if (process.env.NODE_ENV !== 'development') return;
        
        this.game = game;
        this.createDebugPanel();
        this.setupKeyboardShortcuts();
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
        this.debugPanel.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" id="globalDebug"> Global Debug
                </label>
                <button id="togglePanel" style="margin-bottom: 10px; padding: 5px 10px;">Hide Panel</button>
            </div>
            <div id="moduleToggles"></div>
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
            this.updateModuleToggles();
        });
    }

    createModuleToggles() {
        this.moduleToggles = document.getElementById('moduleToggles');
        
        Object.keys(this.config.MODULES).forEach(moduleName => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.cursor = 'pointer';
            label.innerHTML = `
                <input type="checkbox" data-module="${moduleName}"> ${moduleName}
            `;
            this.moduleToggles.appendChild(label);

            const checkbox = label.querySelector('input');
            checkbox.checked = this.config.MODULES[moduleName];
            checkbox.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.setModuleDebug(moduleName, enabled);
            });
        });
    }

    setupPanelToggle() {
        const togglePanel = document.getElementById('togglePanel');
        let isPanelVisible = true;

        togglePanel.addEventListener('click', () => {
            isPanelVisible = !isPanelVisible;
            this.moduleToggles.style.display = isPanelVisible ? 'block' : 'none';
            togglePanel.textContent = isPanelVisible ? 'Hide Panel' : 'Show Panel';
            this.debugPanel.style.backgroundColor = isPanelVisible ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)';
        });
    }

    updateModuleToggles() {
        const checkboxes = this.moduleToggles.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.config.GLOBAL || this.config.MODULES[checkbox.dataset.module];
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '`') {  // backtick key
                document.getElementById('togglePanel').click();
            }
        });
    }

    setModuleDebug(moduleName, enabled) {
        if (this.config.MODULES.hasOwnProperty(moduleName)) {
            this.config.MODULES[moduleName] = enabled;
            this.updateDebugGraphics();
        }
    }

    setGlobalDebug(enabled) {
        this.config.GLOBAL = enabled;
        Object.keys(this.config.MODULES).forEach(module => {
            this.config.MODULES[module] = enabled;
        });
        this.updateDebugGraphics();
    }

    isDebugEnabled(moduleName) {
        return this.config.GLOBAL || this.config.MODULES[moduleName];
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