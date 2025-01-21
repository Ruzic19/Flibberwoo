// src/debug/DebugOverlay.js
import { DEBUG_CONFIG, setGlobalDebug, setModuleDebug } from '../config/debugConfig';
import { logger } from '../utils/LogManager';

export class DebugOverlay {
    constructor(game) {
        this.game = game;
        this.panel = null;
        this.moduleToggles = null;
        this.isPanelVisible = true;
    }

    initialize() {
        if (process.env.NODE_ENV !== 'development') return;
        
        this.createPanel();
        this.createGlobalToggle();
        this.createModuleToggles();
        this.setupKeyboardShortcuts();
        
        logger.info('DebugOverlay', 'Debug controls initialized');
    }

    createPanel() {
        this.panel = document.createElement('div');
        Object.assign(this.panel.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px',
            color: 'white',
            zIndex: '1000',
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: '5px'
        });

        this.panel.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" id="globalDebug"> Global Debug
                </label>
                <button id="togglePanel" style="margin-bottom: 10px; padding: 5px 10px;">Hide Panel</button>
            </div>
            <div id="moduleToggles"></div>
        `;

        document.body.appendChild(this.panel);
        this.moduleToggles = document.getElementById('moduleToggles');
    }

    createGlobalToggle() {
        const globalToggle = document.getElementById('globalDebug');
        globalToggle.checked = DEBUG_CONFIG.GLOBAL;
        globalToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setGlobalDebug(enabled);
            this.updateModuleToggles();
            
            // Update all active scenes
            this.game.scene.scenes.forEach(scene => {
                this.updateSceneDebug(scene, enabled);
            });
        });

        // Add toggle panel button functionality
        const togglePanel = document.getElementById('togglePanel');
        togglePanel.addEventListener('click', () => this.togglePanelVisibility(togglePanel));
    }

    createModuleToggles() {
        Object.keys(DEBUG_CONFIG.MODULES).forEach(moduleName => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.cursor = 'pointer';
            label.innerHTML = `
                <input type="checkbox" data-module="${moduleName}"> ${moduleName}
            `;

            this.moduleToggles.appendChild(label);
            this.setupModuleToggle(label.querySelector('input'), moduleName);
        });
    }

    setupModuleToggle(checkbox, moduleName) {
        checkbox.checked = DEBUG_CONFIG.MODULES[moduleName];
        checkbox.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setModuleDebug(moduleName, enabled);
            
            // Update physics debug if GameScene toggle changes
            if (moduleName === 'GameScene') {
                this.game.scene.scenes.forEach(scene => {
                    this.updateSceneDebug(scene, enabled);
                });
            }

            // Handle module-specific debug setup
            this.game.scene.scenes.forEach(scene => {
                const moduleInstance = scene[moduleName.toLowerCase()];
                if (moduleInstance?.setupDebugGraphics) {
                    moduleInstance.setupDebugGraphics();
                }
            });
        });
    }

    updateModuleToggles() {
        const checkboxes = this.moduleToggles.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = DEBUG_CONFIG.GLOBAL || DEBUG_CONFIG.MODULES[checkbox.dataset.module];
        });
    }

    togglePanelVisibility(toggleButton) {
        this.isPanelVisible = !this.isPanelVisible;
        this.moduleToggles.style.display = this.isPanelVisible ? 'block' : 'none';
        toggleButton.textContent = this.isPanelVisible ? 'Hide Panel' : 'Show Panel';
        this.panel.style.backgroundColor = this.isPanelVisible ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)';
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '`') {  // backtick key
                const toggleButton = document.getElementById('togglePanel');
                if (toggleButton) {
                    toggleButton.click();
                }
            }
        });
    }

    updateSceneDebug(scene, enabled) {
        if (scene.physics?.world) {
            // Clear existing debug graphics
            if (scene.physics.world.debugGraphic) {
                scene.physics.world.debugGraphic.clear();
            }
            
            // Update debug settings
            scene.physics.world.debugGraphic.visible = enabled;
            scene.physics.world.drawDebug = enabled;

            // Force refresh of debug graphics
            if (enabled) {
                scene.physics.world.drawDebug = false;
                scene.physics.world.drawDebug = true;
            }
        }
    }
}