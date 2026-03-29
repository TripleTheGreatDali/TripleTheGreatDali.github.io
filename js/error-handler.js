/**
 * ADVANCED ERROR HANDLER SYSTEM
 * Comprehensive error handling with beautiful UI, recovery suggestions, and logging
 */

class AdvancedErrorHandler {
  constructor() {
    this.errorLog = [];
    this.errorListeners = [];
    this.recoveryStrategies = new Map();
    this.isOnline = navigator.onLine;
    
    this.setupGlobalErrorHandling();
    this.registerRecoveryStrategies();
  }

  /**
   * Setup global error handling
   */
  setupGlobalErrorHandling() {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'UncaughtError',
        message: event.message,
        stack: event.filename + ':' + event.lineno,
        timestamp: new Date().toISOString()
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'UnhandledRejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack || 'No stack trace',
        timestamp: new Date().toISOString()
      });
    });

    // Network status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showNotification('success', '🟢 Back Online', 'Connection restored', 'online-restored');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showNotification('warning', '⚠️ Offline', 'Connection lost. Some features may be unavailable.', 'offline-detected');
    });

    // Console error override for debugging
    const originalError = console.error;
    console.error = (...args) => {
      originalError.apply(console, args);
      if (window.notificationManager) {
        // Log to error handler but don't show every console.error as notification
        this.log('console.error', args[0]);
      }
    };
  }

  /**
   * Handle and display error
   */
  handleError(error) {
    // Normalize error
    const normalizedError = this.normalizeError(error);
    
    // Log error
    this.log(normalizedError.type, normalizedError);
    
    // Add to error log
    this.errorLog.push({
      ...normalizedError,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // Limit error log size
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }

    // Notify listeners
    this.errorListeners.forEach(listener => listener(normalizedError));
    
    // Show user-friendly error
    this.displayError(normalizedError);

    return normalizedError;
  }

  /**
   * Normalize error to standard format
   */
  normalizeError(error) {
    let normalized = {
      type: error.type || 'UnknownError',
      code: error.code || 'ERR_UNKNOWN',
      message: error.message || 'An unexpected error occurred',
      severity: error.severity || 'warning',
      category: error.category || 'general',
      recoverable: error.recoverable !== false,
      suggestion: error.suggestion || ''
    };

    // Categorize based on error
    if (error.message?.includes('timeout') || error.code === 'ERR_TIMEOUT') {
      normalized.category = 'network';
      normalized.suggestion = 'Request took too long. Check your internet connection and try again.';
      normalized.code = 'ERR_TIMEOUT';
    } else if (error.message?.includes('offline') || !this.isOnline) {
      normalized.category = 'network';
      normalized.suggestion = 'You are offline. Connect to the internet and try again.';
      normalized.code = 'ERR_OFFLINE';
    } else if (error.code === 'ERR_NOT_FOUND' || error.status === 404) {
      normalized.category = 'notfound';
      normalized.suggestion = 'The requested resource was not found.';
    } else if (error.code === 'ERR_SERVER' || (error.status && error.status >= 500)) {
      normalized.category = 'server';
      normalized.suggestion = 'Server is having issues. Try again later.';
      normalized.severity = 'error';
    } else if (error.code === 'ERR_VALIDATION') {
      normalized.category = 'validation';
      normalized.suggestion = 'Please check your input and try again.';
    }

    return normalized;
  }

  /**
   * Display error with recovery options
   */
  displayError(error) {
    if (!window.notificationManager) {
      console.error('NotificationManager not available');
      return;
    }

    const errorMessages = this.getErrorMessage(error);
    
    // Show main notification
    const notification = window.notificationManager.error(
      errorMessages.title,
      errorMessages.message,
      error.code
    );

    // Get recovery actions
    const recoveryActions = this.getRecoveryActions(error);
    
    // Show recovery suggestions if available
    if (error.suggestion && recoveryActions.length === 0) {
      this.showRecoverySuggestion(error, errorMessages);
    }

    return notification;
  }

  /**
   * Get error message based on error type
   */
  getErrorMessage(error) {
    const messages = {
      ERR_TIMEOUT: {
        title: '⏱️ Request Timeout',
        message: 'The request took too long. Please check your connection.'
      },
      ERR_OFFLINE: {
        title: '🔌 Offline',
        message: 'You are currently offline. Please check your internet connection.'
      },
      ERR_NOT_FOUND: {
        title: '🔍 Not Found',
        message: 'The requested resource could not be found.'
      },
      ERR_SERVER: {
        title: '⚠️ Server Error',
        message: 'The server encountered an error. Please try again later.'
      },
      ERR_VALIDATION: {
        title: '❌ Validation Error',
        message: error.message || 'Please check your input and try again.'
      },
      ERR_NETWORK: {
        title: '🌐 Network Error',
        message: 'A network error occurred. Please check your connection.'
      }
    };

    return messages[error.code] || {
      title: '⚠️ Error',
      message: error.message || 'An unexpected error occurred'
    };
  }

  /**
   * Register recovery strategies
   */
  registerRecoveryStrategies() {
    this.recoveryStrategies.set('ERR_TIMEOUT', () => {
      // Retry mechanism
      return {
        label: 'Retry',
        action: () => location.reload()
      };
    });

    this.recoveryStrategies.set('ERR_OFFLINE', () => {
      return {
        label: 'Retry',
        action: () => location.reload()
      };
    });

    this.recoveryStrategies.set('ERR_SERVER', () => {
      return {
        label: 'Try Later',
        action: () => {
          this.showNotification('info', '⏰ Remind Me', 'Check back in a few minutes', 'retry-later');
        }
      };
    });
  }

  /**
   * Get recovery actions for error
   */
  getRecoveryActions(error) {
    const strategy = this.recoveryStrategies.get(error.code);
    return strategy ? [strategy()] : [];
  }

  /**
   * Show recovery suggestion
   */
  showRecoverySuggestion(error, messages) {
    const container = document.createElement('div');
    container.className = 'error-recovery-container';
    container.innerHTML = `
      <div class="error-recovery" style="
        background: rgba(255, 152, 0, 0.1);
        border-left: 3px solid #ff9800;
        border-radius: 6px;
        padding: 12px 16px;
        margin-top: 12px;
        color: #ffc107;
        font-size: 0.9em;
      ">
        <strong>💡 Suggestion:</strong> ${this.escapeHtml(error.suggestion)}
      </div>
    `;
    return container;
  }

  /**
   * Show notification
   */
  showNotification(type, title, message, id = null) {
    if (!window.notificationManager) return;
    
    window.notificationManager[type](title, message);
  }

  /**
   * Add error listener
   */
  onError(listener) {
    this.errorListeners.push(listener);
  }

  /**
   * Remove error listener
   */
  offError(listener) {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  /**
   * Log error for debugging
   */
  log(category, error) {
    const style = 'color: #ff006e; font-weight: bold;';
    console.error(`%c[ERROR - ${category}]`, style, error);
  }

  /**
   * Get error statistics
   */
  getStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      byCode: {},
      recentErrors: this.errorLog.slice(-5)
    };

    this.errorLog.forEach(err => {
      stats.byType[err.type] = (stats.byType[err.type] || 0) + 1;
      stats.byCode[err.code] = (stats.byCode[err.code] || 0) + 1;
    });

    return stats;
  }

  /**
   * Log all errors
   */
  logStats() {
    const stats = this.getStats();
    console.table(stats);
    console.log('Recent Errors:', stats.recentErrors);
  }

  /**
   * Clear error log
   */
  clearLog() {
    this.errorLog = [];
  }

  /**
   * Export error log
   */
  exportLog() {
    return JSON.stringify(this.errorLog, null, 2);
  }

  /**
   * Download error log
   */
  downloadLog() {
    const data = this.exportLog();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-log-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Send error to server for analysis
   */
  async sendToServer(error = null) {
    if (!window.apiService) {
      console.warn('API Service not available');
      return;
    }

    try {
      const payload = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        errors: error ? [error] : this.errorLog,
        stats: this.getStats()
      };

      // This endpoint should be configured in your backend
      await window.apiService.post('/api/errors', payload, {
        retry: 1,
        timeout: 10000
      });

      console.log('Error report sent to server');
    } catch (err) {
      console.error('Failed to send error report:', err);
    }
  }

  /**
   * Escape HTML for safety
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Global instance
window.errorHandler = new AdvancedErrorHandler();

// Wrap API calls with error handling
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args).catch(error => {
    window.errorHandler.handleError({
      type: 'FetchError',
      message: error.message,
      code: 'ERR_FETCH',
      severity: 'error'
    });
    throw error;
  });
};

console.log('✅ Advanced Error Handler initialized');
