// src/config/debugConfig.js
export const DEBUG_CONFIG = {
    GLOBAL: false,  // Master switch for all debugging
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

// Helper function to enable/disable specific modules
export function setModuleDebug(moduleName, enabled) {
    if (DEBUG_CONFIG.MODULES.hasOwnProperty(moduleName)) {
        DEBUG_CONFIG.MODULES[moduleName] = enabled;
    }
}

// Helper function to enable/disable all modules
export function setGlobalDebug(enabled) {
    DEBUG_CONFIG.GLOBAL = enabled;
    Object.keys(DEBUG_CONFIG.MODULES).forEach(module => {
        DEBUG_CONFIG.MODULES[module] = enabled;
    });
}

// Helper function to check if debugging is enabled for a module
export function isDebugEnabled(moduleName) {
    return DEBUG_CONFIG.GLOBAL || DEBUG_CONFIG.MODULES[moduleName];
}