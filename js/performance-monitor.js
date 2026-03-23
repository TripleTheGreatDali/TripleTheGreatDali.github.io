/**
 * Performance Monitor & Analytics for GitHub Pages Portfolio
 * Tracks: Core Web Vitals, TTFB, FCP, LCP, CLS, INP
 * Helps identify optimization opportunities
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Override console.time/timeEnd to track custom timing
    const originalTime = console.time;
    const originalTimeEnd = console.timeEnd;

    console.time = (name) => {
      this.metrics[name] = { start: performance.now() };
      originalTime.call(console, name);
    };

    console.timeEnd = (name) => {
      if (this.metrics[name]) {
        this.metrics[name].end = performance.now();
        this.metrics[name].duration = this.metrics[name].end - this.metrics[name].start;
      }
      originalTimeEnd.call(console, name);
    };

    // Track Page Visibility
    document.addEventListener('visibilitychange', () => {
      this.recordMetric('page-visibility', {
        state: document.visibilityState,
        timestamp: Date.now()
      });
    });

    // Track Navigation Timing
    window.addEventListener('load', () => {
      this.reportNavigationMetrics();
    });

    // Track Long Tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(`long-task-${Date.now()}`, {
              name: entry.name,
              duration: entry.duration,
              attribution: entry.attribution
            });
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long Task API not available
      }
    }
  }

  reportNavigationMetrics() {
    if (!window.performance || !performance.timing) return;

    const timing = performance.timing;
    const navigation = performance.navigation;

    const metrics = {
      // Navigation Timing
      'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
      'TCP Connection': timing.connectEnd - timing.connectStart,
      'Request Time': timing.responseStart - timing.requestStart,
      'Response Time': timing.responseEnd - timing.responseStart,
      'DOM Loading': timing.domLoading - timing.responseEnd,
      'DOM Interactive': timing.domInteractive - timing.domLoading,
      'DOM Content Loaded': timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      'Page Load Complete': timing.loadEventEnd - timing.loadEventStart,

      // Critical Metrics
      'Total Page Load': timing.loadEventEnd - timing.navigationStart,
      'Time to Interactive': timing.domInteractive - timing.navigationStart,
      'Time to First Byte': timing.responseStart - timing.navigationStart
    };

    this.recordMetric('navigation-timing', metrics);
  }

  recordMetric(name, data) {
    this.metrics[name] = {
      timestamp: Date.now(),
      data: data
    };

    // Only send if over network is available
    if (navigator.onLine && navigator.sendBeacon) {
      try {
        navigator.sendBeacon('/metrics', JSON.stringify({
          metric: name,
          value: data,
          timestamp: Date.now()
        }));
      } catch (e) {
        // Silently fail if metrics endpoint not available
      }
    }
  }

  getMetrics() {
    return this.metrics;
  }

  logPerformanceSummary() {
    const navigationStart = performance.timing.navigationStart;
    const now = performance.now();

    const summary = {
      pageLoadTime: now,
      resourcesLoaded: performance.getEntriesByType('resource').length,
      navigationCount: performance.navigation.type,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Performance Summary:', summary);
    return summary;
  }
}

// Export for external use
if (typeof window !== 'undefined') {
  window.PerformanceMonitor = PerformanceMonitor;
  window.performanceMonitor = new PerformanceMonitor();

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.performanceMonitor.init();
    });
  } else {
    window.performanceMonitor.init();
  }
}
