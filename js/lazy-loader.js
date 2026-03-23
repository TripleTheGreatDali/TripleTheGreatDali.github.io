/**
 * Lazy Loader for Images & Heavy Components
 * Uses Intersection Observer for efficient lazy loading
 * Supports blur-up effect and native lazy loading fallback
 */

class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.01,
      placeholderSelector: options.placeholderSelector || '[data-lazy]',
      errorClass: options.errorClass || 'lazy-error',
      loadedClass: options.loadedClass || 'lazy-loaded',
      ...options
    };

    this.images = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Check if Intersection Observer API is available
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback: load all images immediately
      this.loadAllImages();
    }

    // Also add native lazy loading for modern browsers
    this.addNativeLazyLoading();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });

    // Find all lazy-loadable images
    document.querySelectorAll(this.options.placeholderSelector).forEach((img) => {
      this.observer.observe(img);
      this.images.push(img);
    });
  }

  loadImage(img) {
    if (img.dataset.src) {
      const src = img.dataset.src;

      // Create new image to validate it loads
      const tmpImg = new Image();

      tmpImg.onload = () => {
        img.src = src;
        img.classList.add(this.options.loadedClass);
        img.removeAttribute('data-src');

        // Trigger reflow to enable animation
        void img.offsetHeight;
      };

      tmpImg.onerror = () => {
        img.classList.add(this.options.errorClass);
      };

      tmpImg.src = src;
    }
  }

  loadAllImages() {
    document.querySelectorAll(this.options.placeholderSelector).forEach((img) => {
      this.loadImage(img);
    });
  }

  addNativeLazyLoading() {
    // Add native lazy loading as fallback
    document.querySelectorAll('img[data-src]').forEach((img) => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Resume observing after dynamic content added
  observe(elements) {
    if (!this.observer) return;
    elements.forEach((el) => {
      this.observer.observe(el);
      this.images.push(el);
    });
  }
}

// Export for external use
if (typeof window !== 'undefined') {
  window.LazyLoader = LazyLoader;

  // Auto-initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader({
      rootMargin: '100px',
      threshold: 0.01
    });
  });
}
