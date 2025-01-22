// src/utils/LogManager.js
import { debugOverlay } from '../debug/DebugOverlay';

export class LogManager {
    static instance = null;

    constructor() {
        if (LogManager.instance) {
            return LogManager.instance;
        }
        
        this.logHistory = [];
        this.maxHistorySize = 1000;
        this.mutedModules = new Set();
        
        this.LOG_LEVELS = {
            DEBUG: 'debug',
            INFO: 'info',
            WARN: 'warn',
            ERROR: 'error'
        };

        // Make logger available globally for DebugOverlay
        window.logger = this;

        LogManager.instance = this;
    }

    // Add static getInstance method
    static getInstance() {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager();
        }
        return LogManager.instance;
    }

    muteModule(moduleName) {
        this.mutedModules.add(moduleName);
    }

    unmuteModule(moduleName) {
        this.mutedModules.delete(moduleName);
    }

    isModuleMuted(moduleName) {
        return this.mutedModules.has(moduleName);
    }

    isDebugEnabled(moduleName) {
        return debugOverlay.isLoggingEnabled(moduleName);
    }

    log(moduleName, message, data = null, level = 'debug') {
        // Skip if module is muted
        if (this.isModuleMuted(moduleName)) {
            return;
        }

        // For debug level, check both debug overlay and module muting
        if (level === this.LOG_LEVELS.DEBUG && !this.isDebugEnabled(moduleName)) {
            return;
        }

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            module: moduleName,
            message,
            data,
            level
        };

        this.logHistory.push(logEntry);
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }

        const formattedMessage = `[${timestamp}] [${moduleName}] ${message}`;
        const debugIndicator = level === this.LOG_LEVELS.DEBUG ? '[DEBUG] ' : '';
        const finalMessage = debugIndicator + formattedMessage;
        
        switch (level) {
            case this.LOG_LEVELS.ERROR:
                console.error(finalMessage, data || '');
                break;
            case this.LOG_LEVELS.WARN:
                console.warn(finalMessage, data || '');
                break;
            case this.LOG_LEVELS.INFO:
                console.info(finalMessage, data || '');
                break;
            default:
                console.log(finalMessage, data || '');
        }
    }

    debug(moduleName, message, data = null) {
        this.log(moduleName, message, data, this.LOG_LEVELS.DEBUG);
    }

    info(moduleName, message, data = null) {
        this.log(moduleName, message, data, this.LOG_LEVELS.INFO);
    }

    warn(moduleName, message, data = null) {
        this.log(moduleName, message, data, this.LOG_LEVELS.WARN);
    }

    error(moduleName, message, data = null) {
        this.log(moduleName, message, data, this.LOG_LEVELS.ERROR);
    }

    getHistory() {
        return [...this.logHistory];
    }

    clearHistory() {
        this.logHistory = [];
    }

    exportLogs() {
        return JSON.stringify(this.logHistory, null, 2);
    }
}

// Create a default instance
export const logger = LogManager.getInstance();