/**
 * GLOBAL LOADING STATE MANAGER
 * Tracks loading states across the application and provides UI feedback
 * Shows loading indicators for async operations
 */

class LoadingStateManager {
  constructor(options = {}) {
    this.indicators = new Map();
    this.globalIndicator = null;
    this.showDelay = options.showDelay || 300; // Only show if loading > 300ms
    this.timeouts = new Map();
    
    this.init();
  }

  init() {
    // Create global loading indicator
    const globalIndicator = document.createElement('div');
    globalIndicator.id = 'global-loading-indicator';
    globalIndicator.className = 'loading-indicator loading-indicator-global';
    globalIndicator.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading...</div>
    `;
    document.body.appendChild(globalIndicator);
    this.globalIndicator = globalIndicator;

    // Inject styles
    if (!document.getElementById('loading-indicator-styles')) {
      this.injectStyles();
    }
  }

  injectStyles() {
    const style = document.createElement('style');
    style.id = 'loading-indicator-styles';
    style.textContent = `
      .loading-indicator {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        color: #1f4e79;
        font-weight: 500;
        z-index: 1000;
      }

      .loading-indicator.loading-indicator-active {
        display: flex;
      }

      .loading-indicator-global {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, rgba(31, 78, 121, 0.95), rgba(0, 217, 255, 0.95));
        padding: 12px 20px;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .loading-indicator-inline {
        padding: 16px;
        border-radius: 8px;
        background: rgba(31, 78, 121, 0.05);
        border: 2px solid rgba(31, 78, 121, 0.2);
        color: #1f4e79;
      }

      .loading-indicator-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
      }

      .loading-spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .loading-text {
        font-size: 13px;
        letter-spacing: 0.5px;
      }

      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      @media (max-width: 768px) {
        .loading-indicator-global {
          font-size: 14px;
          padding: 10px 16px;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Show loading state for specific endpoint/container
   */
  show(identifier, options = {}) {
    const {
      type = 'global', // 'global', 'inline', 'overlay'
      message = 'Loading...',
      container = null
    } = options;

    // Clear existing timeout
    if (this.timeouts.has(identifier)) {
      clearTimeout(this.timeouts.get(identifier));
    }

    // Schedule showing after delay
    const timeoutId = setTimeout(() => {
      if (type === 'global') {
        this.globalIndicator.classList.add('loading-indicator-active');
        this.globalIndicator.querySelector('.loading-text').textContent = message;
      } else if (type === 'inline' && container) {
        container.classList.add('loading-indicator-active');
      }

      this.indicators.set(identifier, { type, message, container });
    }, this.showDelay);

    this.timeouts.set(identifier, timeoutId);
  }

  /**
   * Hide loading state
   */
  hide(identifier) {
    // Clear timeout
    if (this.timeouts.has(identifier)) {
      clearTimeout(this.timeouts.get(identifier));
      this.timeouts.delete(identifier);
    }

    const indicator = this.indicators.get(identifier);
    if (!indicator) return;

    if (indicator.type === 'global') {
      this.globalIndicator.classList.remove('loading-indicator-active');
    } else if (indicator.container) {
      indicator.container.classList.remove('loading-indicator-active');
    }

    this.indicators.delete(identifier);
  }

  /**
   * Check if any loading is active
   */
  isLoading() {
    return this.indicators.size > 0 || this.timeouts.size > 0;
  }

  /**
   * Hide all loading indicators
   */
  hideAll() {
    this.indicators.forEach((_, identifier) => this.hide(identifier));
  }

  /**
   * Create skeleton loader for content
   */
  createSkeleton(lines = 3, width = '100%') {
    const skeleton = document.createElement('div');
    skeleton.className = 'loading-skeleton';
    skeleton.style.cssText = `
      width: ${width};
      height: ${lines * 1.5}em;
      border-radius: 4px;
      margin-bottom: 12px;
    `;
    return skeleton;
  }
}

// Initialize global loading state manager
const loadingManager = new LoadingStateManager({
  showDelay: 300
});

// Export globally
window.loadingManager = loadingManager;
