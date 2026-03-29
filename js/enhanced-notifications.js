/**
 * ENHANCED NOTIFICATIONS SYSTEM
 * Beautiful, impressive notifications with animations and advanced features
 */

class EnhancedNotificationManager {
  constructor(options = {}) {
    this.notifications = [];
    this.container = null;
    this.options = {
      maxNotifications: 8,
      position: 'top-right', // top-right, top-left, bottom-right, bottom-left
      defaultDuration: 4000,
      animationSpeed: 300,
      ...options
    };
    
    this.soundEnabled = options.soundEnabled !== false;
    this.init();
  }

  /**
   * Initialize notification system
   */
  init() {
    this.createContainer();
    this.injectStyles();
    window.addEventListener('resize', () => this.updatePosition());
  }

  /**
   * Create notification container
   */
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = `notifications-container notifications-${this.options.position}`;
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Notifications');
    this.container.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.container);
  }

  /**
   * Show notification
   */
  show(options = {}) {
    const config = {
      type: 'info', // success, error, warning, info, loading
      title: '',
      message: 'Operation completed',
      duration: this.options.defaultDuration,
      icon: '',
      closable: true,
      onClick: null,
      actions: [],
      ...options
    };

    // Check max notifications
    if (this.notifications.length >= this.options.maxNotifications) {
      const oldNotification = this.notifications.shift();
      oldNotification.remove();
    }

    // Create notification element
    const notification = this.createNotification(config);
    
    // Add to list
    this.notifications.push(notification);
    
    // Add to DOM
    this.container.appendChild(notification.element);
    
    // Trigger animation
    setTimeout(() => {
      notification.element.classList.add('notification-enter');
    }, 10);

    // Auto dismiss
    if (config.duration > 0 && config.type !== 'loading') {
      notification.timeout = setTimeout(() => {
        this.dismiss(notification);
      }, config.duration);
    }

    return notification;
  }

  /**
   * Create notification element
   */
  createNotification(config) {
    const notification = {
      id: Date.now() + Math.random(),
      config,
      timeout: null,
      element: null,
      remove: function() {
        if (this.timeout) clearTimeout(this.timeout);
        this.element.classList.add('notification-exit');
        setTimeout(() => {
          if (this.element.parentElement) {
            this.element.remove();
          }
        }, this.options.animationSpeed);
      }
    };

    // Create element
    const el = document.createElement('div');
    el.className = `notification notification-${config.type}`;
    el.setAttribute('role', 'status');
    
    // Create content
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ⓘ',
      loading: '⟳'
    };

    const icon = config.icon || icons[config.type];

    el.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">
          ${config.title ? `<div class="notification-title">${this.escapeHtml(config.title)}</div>` : ''}
          <div class="notification-text">${this.escapeHtml(config.message)}</div>
          ${config.actions.length > 0 ? `<div class="notification-actions">${config.actions.map(a => `<button class="notification-action">${this.escapeHtml(a.label)}</button>`).join('')}</div>` : ''}
        </div>
        ${config.closable ? `<button class="notification-close" aria-label="Close notification">✕</button>` : ''}
      </div>
      <div class="notification-progress"></div>
    `;

    // Close button
    const closeBtn = el.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.dismiss(notification));
    }

    // Click handler
    if (config.onClick) {
      el.addEventListener('click', config.onClick);
    }

    // Action buttons
    const actionBtns = el.querySelectorAll('.notification-action');
    actionBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        config.actions[idx].action?.();
        this.dismiss(notification);
      });
    });

    // Progress animation for duration
    if (config.duration > 0 && config.type !== 'loading') {
      const progress = el.querySelector('.notification-progress');
      progress.style.animation = `notificationProgress ${config.duration}ms linear forwards`;
    }

    notification.element = el;
    notification.options = this.options;
    
    return notification;
  }

  /**
   * Dismiss notification
   */
  dismiss(notification) {
    if (this.notifications.includes(notification)) {
      this.notifications = this.notifications.filter(n => n !== notification);
      notification.remove();
    }
  }

  /**
   * Dismiss all notifications
   */
  dismissAll() {
    this.notifications.forEach(notification => notification.remove());
    this.notifications = [];
  }

  /**
   * Success notification
   */
  success(title, message, options = {}) {
    return this.show({
      type: 'success',
      title: title || 'Success',
      message,
      duration: options.duration || 3000,
      ...options
    });
  }

  /**
   * Error notification
   */
  error(title, message, code = '', options = {}) {
    return this.show({
      type: 'error',
      title: title || 'Error',
      message: code ? `${message} (${code})` : message,
      duration: options.duration !== undefined ? options.duration : 5000,
      closable: true,
      ...options
    });
  }

  /**
   * Warning notification
   */
  warning(title, message, options = {}) {
    return this.show({
      type: 'warning',
      title: title || 'Warning',
      message,
      duration: options.duration || 4000,
      ...options
    });
  }

  /**
   * Info notification
   */
  info(title, message, options = {}) {
    return this.show({
      type: 'info',
      title: title || 'Info',
      message,
      duration: options.duration || 3000,
      ...options
    });
  }

  /**
   * Loading notification
   */
  loading(title, message, options = {}) {
    return this.show({
      type: 'loading',
      title: title || 'Loading',
      message,
      duration: 0,
      closable: false,
      ...options
    });
  }

  /**
   * Update position
   */
  updatePosition() {
    if (this.container) {
      this.container.className = `notifications-container notifications-${this.options.position}`;
    }
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Inject styles
   */
  injectStyles() {
    if (document.getElementById('enhanced-notifications-styles')) return;

    const style = document.createElement('style');
    style.id = 'enhanced-notifications-styles';
    style.textContent = `
      .notifications-container {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        width: 100%;
        max-width: 400px;
        padding: 16px;
      }

      .notifications-top-right {
        top: 0;
        right: 0;
      }

      .notifications-top-left {
        top: 0;
        left: 0;
      }

      .notifications-bottom-right {
        bottom: 0;
        right: 0;
      }

      .notifications-bottom-left {
        bottom: 0;
        left: 0;
      }

      .notification {
        pointer-events: auto;
        margin-bottom: 12px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(10, 14, 39, 0.95);
        animation: slideIn 0.3s ease-out;
      }

      .notification-enter {
        animation: slideIn 0.3s ease-out!important;
      }

      .notification-exit {
        animation: slideOut 0.3s ease-in!important;
      }

      .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        color: var(--text-primary);
      }

      .notification-icon {
        font-size: 1.5em;
        min-width: 24px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: spin 0.6s ease-in-out;
      }

      .notification-success .notification-icon {
        color: #4caf50;
        animation: pulse 0.6s ease-out;
      }

      .notification-error .notification-icon {
        color: #ff006e;
        animation: shake 0.4s ease;
      }

      .notification-warning .notification-icon {
        color: #ffc107;
      }

      .notification-info .notification-icon {
        color: var(--accent-neon);
      }

      .notification-loading .notification-icon {
        color: var(--accent-cyan);
        animation: spin 0.8s linear infinite;
      }

      .notification-message {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .notification-title {
        font-weight: 600;
        font-size: 0.95em;
        color: var(--text-primary);
      }

      .notification-text {
        font-size: 0.9em;
        color: var(--text-secondary);
        line-height: 1.4;
      }

      .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2em;
        padding: 4px 8px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        opacity: 0.7;
      }

      .notification-close:hover {
        opacity: 1;
        color: var(--accent-neon);
      }

      .notification-progress {
        height: 3px;
        background: linear-gradient(90deg, rgba(0, 217, 255, 0.6), transparent);
        width: 100%;
      }

      .notification-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .notification-action {
        padding: 6px 12px;
        background: rgba(0, 217, 255, 0.2);
        border: 1px solid rgba(0, 217, 255, 0.3);
        color: var(--accent-neon);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85em;
        transition: all 0.2s ease;
      }

      .notification-action:hover {
        background: rgba(0, 217, 255, 0.3);
        border-color: var(--accent-neon);
      }

      /* Color variants */
      .notification-success {
        background: rgba(76, 175, 80, 0.15);
        border-color: rgba(76, 175, 80, 0.3);
      }

      .notification-error {
        background: rgba(255, 0, 110, 0.15);
        border-color: rgba(255, 0, 110, 0.3);
      }

      .notification-warning {
        background: rgba(255, 193, 7, 0.15);
        border-color: rgba(255, 193, 7, 0.3);
      }

      .notification-info {
        background: rgba(0, 217, 255, 0.15);
        border-color: rgba(0, 217, 255, 0.3);
      }

      .notification-loading {
        background: rgba(0, 240, 255, 0.15);
        border-color: rgba(0, 240, 255, 0.3);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(400px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(400px);
        }
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }

      @keyframes notificationProgress {
        from { width: 100%; }
        to { width: 0; }
      }

      @media (max-width: 480px) {
        .notifications-container {
          max-width: 100%;
        }

        .notification-content {
          padding: 12px;
          gap: 10px;
        }

        .notification-text {
          font-size: 0.85em;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

// Initialize enhanced notification manager
if (!window.enhancedNotificationManager) {
  window.enhancedNotificationManager = new EnhancedNotificationManager();
  console.log('✅ Enhanced Notification Manager initialized');
}
