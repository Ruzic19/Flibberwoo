// src/utils/LogManager.js
import { DEBUG_CONFIG, isDebugEnabled } from '../config/debugConfig';

export class LogManager {
    static instance = null;
    
    constructor() {
        if (LogManager.instance) {
            return LogManager.instance;
        }
        
        this.debugModules = new Set();
        this.logHistory = [];
        this.maxHistorySize = 1000;
        
        // Log levels
        this.LOG_LEVELS = {
            DEBUG: 'debug',
            INFO: 'info',
            WARN: 'warn',
            ERROR: 'error'
        };

        LogManager.instance = this;
    }

    static getInstance() {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager();
        }
        return LogManager.instance;
    }

    // Enable/disable debugging for specific modules
    enableModule(moduleName) {
        this.debugModules.add(moduleName);
    }

    disableModule(moduleName) {
        this.debugModules.delete(moduleName);
    }

    // Check if debugging is enabled for a module
    isDebugEnabled(moduleName) {
        return isDebugEnabled(moduleName);
    }

    // Main logging method
    log(moduleName, message, data = null, level = 'debug') {
        // Only log debug messages if debugging is enabled for this module
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

        // Add to history
        this.logHistory.push(logEntry);
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }

        // Format the console output
        const formattedMessage = `[${timestamp}] [${moduleName}] ${message}`;
        
        switch (level) {
            case this.LOG_LEVELS.ERROR:
                console.error(formattedMessage, data || '');
                break;
            case this.LOG_LEVELS.WARN:
                console.warn(formattedMessage, data || '');
                break;
            case this.LOG_LEVELS.INFO:
                console.info(formattedMessage, data || '');
                break;
            default:
                console.log(formattedMessage, data || '');
        }
    }

    // Convenience methods for different log levels
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

    // Get log history
    getHistory() {
        return [...this.logHistory];
    }

    // Clear log history
    clearHistory() {
        this.logHistory = [];
    }

    // Export logs
    exportLogs() {
        return JSON.stringify(this.logHistory, null, 2);
    }
}

// Create a default instance
export const logger = LogManager.getInstance();