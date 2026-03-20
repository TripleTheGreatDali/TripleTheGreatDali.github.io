/**
 * GLOBAL NOTIFICATION SYSTEM
 * Centralized UI feedback for errors, success, info, and warnings across the application
 */

class NotificationManager {
  constructor(options = {}) {
    this.container = null;
    this.notifications = [];
    this.queue = [];
    this.maxNotifications = options.maxNotifications || 5;
    this.defaultDuration = options.defaultDuration || 4000;
    this.position = options.position || 'top-right';
    
    this.init();
  }

  init() {
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = `notification-container notification-${this.position}`;
    document.body.appendChild(this.container);

    // Add styles dynamically if not already present
    if (!document.getElementById('notification-styles')) {
      this.injectStyles();
    }
  }

  injectStyles() {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification-container {
        position: fixed;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        max-width: 400px;
        pointer-events: none;
      }

      .notification-container.notification-top-right {
        top: 20px;
        right: 20px;
      }

      .notification-container.notification-top-left {
        top: 20px;
        left: 20px;
      }

      .notification-container.notification-bottom-right {
        bottom: 20px;
        right: 20px;
      }

      .notification-container.notification-bottom-left {
        bottom: 20px;
        left: 20px;
      }

      .notification {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #333;
        pointer-events: auto;
        animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 4.7s forwards;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        max-width: 100%;
        word-break: break-word;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      .notification.notification-left {
        animation: slideInLeft 0.3s ease-out, slideOutLeft 0.3s ease-in 4.7s forwards;
      }

      @keyframes slideInLeft {
        from {
          transform: translateX(-400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutLeft {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(-400px);
          opacity: 0;
        }
      }

      .notification-icon {
        font-size: 20px;
        flex-shrink: 0;
        padding-top: 2px;
      }

      .notification-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .notification-title {
        font-weight: 600;
        color: #1f1f1f;
      }

      .notification-message {
        font-weight: 400;
        color: #666;
        font-size: 13px;
      }

      .notification-code {
        font-family: 'Monaco', 'Courier New', monospace;
        font-size: 11px;
        color: #999;
        margin-top: 4px;
        padding: 4px 8px;
        background: #f5f5f5;
        border-radius: 4px;
      }

      .notification-close {
        flex-shrink: 0;
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        margin: -4px -8px 0 8px;
        transition: color 0.2s;
      }

      .notification-close:hover {
        color: #333;
      }

      /* Type-specific styles */
      .notification.notification-success {
        border-left-color: #22c55e;
        background: #f0fdf4;
      }

      .notification.notification-success .notification-title {
        color: #15803d;
      }

      .notification.notification-success .notification-message {
        color: #166534;
      }

      .notification.notification-success .notification-icon {
        color: #22c55e;
      }

      .notification.notification-error {
        border-left-color: #ef4444;
        background: #fef2f2;
      }

      .notification.notification-error .notification-title {
        color: #dc2626;
      }

      .notification.notification-error .notification-message {
        color: #991b1b;
      }

      .notification.notification-error .notification-icon {
        color: #ef4444;
      }

      .notification.notification-warning {
        border-left-color: #f59e0b;
        background: #fffbeb;
      }

      .notification.notification-warning .notification-title {
        color: #d97706;
      }

      .notification.notification-warning .notification-message {
        color: #b45309;
      }

      .notification.notification-warning .notification-icon {
        color: #f59e0b;
      }

      .notification.notification-info {
        border-left-color: #3b82f6;
        background: #eff6ff;
      }

      .notification.notification-info .notification-title {
        color: #1e40af;
      }

      .notification.notification-info .notification-message {
        color: #1e3a8a;
      }

      .notification.notification-info .notification-icon {
        color: #3b82f6;
      }

      .notification.notification-loading {
        border-left-color: #06b6d4;
        background: #f0f9fa;
        animation: none;
      }

      .notification.notification-loading .notification-icon {
        color: #06b6d4;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .notification-container {
          max-width: calc(100vw - 32px);
        }

        .notification {
          font-size: 13px;
          padding: 12px 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  show(options) {
    const {
      type = 'info',
      title = '',
      message = '',
      code = '',
      duration = this.defaultDuration,
      closable = true,
      onClose = null
    } = options;

    // Queue if too many notifications
    if (this.notifications.length >= this.maxNotifications) {
      this.queue.push(arguments[0]);
      return;
    }

    const notification = this._createNotification(
      type,
      title,
      message,
      code,
      closable,
      onClose
    );

    this.notifications.push(notification);
    this.container.appendChild(notification.element);

    if (duration > 0) {
      notification.timeoutId = setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
  }

  _createNotification(type, title, message, code, closable, onClose) {
    const element = document.createElement('div');
    element.className = `notification notification-${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ⓘ',
      loading: '⟳'
    };

    element.innerHTML = `
      <div class="notification-icon">${icons[type] || '•'}</div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${this._escape(title)}</div>` : ''}
        ${message ? `<div class="notification-message">${this._escape(message)}</div>` : ''}
        ${code ? `<div class="notification-code">${this._escape(code)}</div>` : ''}
      </div>
      ${closable ? '<button class="notification-close">×</button>' : ''}
    `;

    const notification = {
      element,
      type,
      title,
      message,
      timeoutId: null,
      onClose
    };

    if (closable) {
      const closeBtn = element.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => this.remove(notification));
    }

    return notification;
  }

  remove(notification) {
    notification.element.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
        notification.element.remove();
        if (notification.onClose) notification.onClose();
      }

      // Show next queued notification
      if (this.queue.length > 0) {
        const nextOptions = this.queue.shift();
        this.show(nextOptions);
      }
    }, 300);

    if (notification.timeoutId) {
      clearTimeout(notification.timeoutId);
    }
  }

  removeAll() {
    this.notifications.forEach(notif => {
      clearTimeout(notif.timeoutId);
      notif.element.remove();
    });
    this.notifications = [];
    this.queue = [];
  }

  // Helper methods
  success(title, message, code = '') {
    return this.show({ type: 'success', title, message, code });
  }

  error(title, message, code = '') {
    return this.show({ type: 'error', title, message, code, duration: 6000 });
  }

  warning(title, message, code = '') {
    return this.show({ type: 'warning', title, message, code });
  }

  info(title, message, code = '') {
    return this.show({ type: 'info', title, message, code });
  }

  loading(title, message = '') {
    return this.show({ type: 'loading', title, message, duration: 0, closable: false });
  }

  _escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize global notification manager
const notificationManager = new NotificationManager({
  position: 'top-right',
  maxNotifications: 5,
  defaultDuration: 4000
});

// Global helper function
function showNotification(options) {
  return notificationManager.show(options);
}

// Export globally
window.notificationManager = notificationManager;
window.showNotification = showNotification;
