/**
 * INITIALIZATION SAFEGUARD
 * Ensures critical systems are available even if main modules fail to load
 * Runs before other scripts to provide fallback implementations
 */

// Failsafe loading manager
if (typeof loadingManager === 'undefined') {
  window.loadingManager = {
    show: (id, opts) => console.log('[Loading]', opts?.message || 'Loading...'),
    hide: (id) => console.log('[Loading] Done'),
    hideAll: () => console.log('[Loading] All done'),
    isLoading: () => false
  };
}

// Failsafe notification manager
if (typeof notificationManager === 'undefined') {
  window.notificationManager = {
    success: (title, msg) => console.log('[✓]', title, msg),
    error: (title, msg, code) => console.error('[✗]', title, msg, code),
    warning: (title, msg) => console.warn('[⚠]', title, msg),
    info: (title, msg) => console.info('[ℹ]', title, msg)
  };
}

// Failsafe API service
if (typeof apiService === 'undefined') {
  window.apiService = {
    request: async (endpoint) => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      } catch (e) {
        console.error('[API] Fetch failed:', endpoint, e.message);
        throw e;
      }
    },
    batch: async (requests) => {
      const results = await Promise.all(
        requests.map(r => 
          apiService.request(r.endpoint)
            .then(data => ({ success: true, data, endpoint: r.endpoint }))
            .catch(error => ({ success: false, error, endpoint: r.endpoint }))
        )
      );
      return { results, errors: results.filter(r => !r.success) };
    },
    onLoading: () => {},
    onError: () => {},
    onSuccess: () => {},
    onRetry: () => {}
  };
}

console.log('[Safeguard] Initialization complete');
