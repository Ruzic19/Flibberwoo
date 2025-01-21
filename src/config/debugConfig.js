// src/config/debugConfig.js
import { debugOverlay } from '../debug/DebugOverlay';

// Helper function to enable/disable specific modules
export function setModuleDebug(moduleName, enabled) {
    debugOverlay.setModuleDebug(moduleName, enabled);
}

// Helper function to enable/disable all modules
export function setGlobalDebug(enabled) {
    debugOverlay.setGlobalDebug(enabled);
}

// Helper function to check if debugging is enabled for a module
export function isDebugEnabled(moduleName) {
    return debugOverlay.isDebugEnabled(moduleName);
}

// Export the debug configuration for reference
export const DEBUG_CONFIG = debugOverlay.config;