/**
 * CENTRALIZED API SERVICE LAYER
 * Provides unified API communication, error handling, caching, retry logic,
 * and loading state management for the entire application.
 * 
 * This is the single source of truth for all backend/data interactions.
 */

class APIService {
  constructor(config = {}) {
    // Configuration
    this.baseURL = config.baseURL || 'http://localhost:5000';
    this.timeout = config.timeout || 10000;
    this.retryAttempts = 1; // Disable retry for file requests
    this.retryDelay = config.retryDelay || 1000;
    
    // State management
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.cacheDuration = config.cacheDuration || 5 * 60 * 1000; // 5 minutes default
    this.loadingState = new Map();
    this.requestQueue = [];
    this.rateLimitDelay = 100; // ms between requests
    
    // Event listeners for global state
    this.listeners = {
      loading: [],
      error: [],
      success: [],
      retry: []
    };
    
    // Request tracking
    this.activeRequests = new Map();
    this.requestId = 0;
    
    // Offline detection
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => this._handleOnline());
    window.addEventListener('offline', () => this._handleOffline());
  }

  /**
   * MAIN REQUEST METHOD - All API calls go through here
   * @param {string} endpoint - API endpoint (e.g., '/api/blog')
   * @param {object} options - Request options (method, body, headers, cache, retry)
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      useCache = true,
      forceFresh = false,
      timeout = this.timeout,
      retry = this.retryAttempts,
      onLoadingChange = null
    } = options;

    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body)}`;
    const requestId = ++this.requestId;

    try {
      // Check cache first (unless forceFresh)
      if (!forceFresh && useCache && method === 'GET' && this._isCacheValid(cacheKey)) {
        console.log(`[API] Cache HIT for ${endpoint}`);
        this._broadcastSuccess(endpoint, this.cache.get(cacheKey));
        return this.cache.get(cacheKey);
      }

      // Check if already loading (prevent duplicate requests)
      if (this.loadingState.has(cacheKey)) {
        console.log(`[API] Returning existing request for ${endpoint}`);
        return this.activeRequests.get(cacheKey);
      }

      // Rate limiting: wait if needed
      await this._rateLimit();

      // Mark as loading
      this.loadingState.set(cacheKey, true);
      this._broadcastLoading(endpoint, true);
      if (onLoadingChange) onLoadingChange(true);

      // Make request with retry logic
      let lastError;
      for (let attempt = 1; attempt <= retry; attempt++) {
        try {
          const response = await this._makeRequest(
            endpoint,
            { method, body, headers, timeout },
            requestId
          );

          // Cache successful response
          if (method === 'GET') {
            this.cache.set(cacheKey, response.data);
            this.cacheExpiry.set(cacheKey, Date.now() + this.cacheDuration);
          }

          this._broadcastSuccess(endpoint, response.data);
          return response.data;
        } catch (error) {
          lastError = error;
          if (attempt < retry) {
            const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
            console.warn(
              `[API] Retry ${attempt}/${retry} for ${endpoint} after ${delay}ms`,
              error.message
            );
            this._broadcastRetry(endpoint, attempt, retry, error);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError;
    } catch (error) {
      console.error(`[API] Request failed: ${endpoint}`, error);
      this._broadcastError(endpoint, error);
      throw this._normalizeError(error, endpoint);
    } finally {
      this.loadingState.delete(cacheKey);
      this.activeRequests.delete(cacheKey);
      this._broadcastLoading(endpoint, false);
      if (onLoadingChange) onLoadingChange(false);
    }
  }

  /**
   * Make actual HTTP request with timeout
   */
  async _makeRequest(endpoint, options, requestId) {
    const { method, body, headers, timeout } = options;
    
    // For direct file paths (e.g., /assets/data/...), don't prepend baseURL
    // For API endpoints (e.g., /api/...), prepend baseURL
    const url = endpoint.startsWith('/assets/') ? endpoint : `${this.baseURL}${endpoint}`;
    
    console.log(`[API] Fetching from: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...headers
        },
        signal: controller.signal
      };

      if (body) config.body = JSON.stringify(body);

      console.log(`[API] Making ${method} request to: ${url}`);
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await this._parseResponse(response);
        const error = new Error(errorData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        console.error(`[API] HTTP Error: ${response.status} for ${url}`, errorData);
        throw error;
      }

      const data = await this._parseResponse(response);
      console.log(`[API] Successfully fetched: ${url}`, data);
      return { status: response.status, data };
    } catch (error) {
      console.error(`[API] Fetch error for ${url}:`, error);
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 'TIMEOUT');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse response (handle JSON and text)
   */
  async _parseResponse(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  }

  /**
   * Normalize errors into consistent format
   */
  _normalizeError(error, endpoint) {
    if (error instanceof APIError) return error;

    let code = 'UNKNOWN_ERROR';
    let message = error.message || 'An unknown error occurred';

    if (error.name === 'AbortError') {
      code = 'TIMEOUT';
      message = `Request timeout (${this.timeout}ms)`;
    } else if (!this.isOnline) {
      code = 'OFFLINE';
      message = 'You are currently offline';
    } else if (error.status === 404) {
      code = 'NOT_FOUND';
      message = `Resource not found: ${endpoint}`;
    } else if (error.status === 500) {
      code = 'SERVER_ERROR';
      message = 'Server error. Please try again later';
    }

    return new APIError(message, code, error.status);
  }

  /**
   * CONVENIENCE METHODS for common operations
   */

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * BATCH REQUEST - Execute multiple requests efficiently
   */
  async batch(requests) {
    // Execute requests in parallel but with rate limiting
    const results = [];
    const errors = [];

    for (const req of requests) {
      try {
        const result = await this.request(req.endpoint, req.options);
        results.push({ success: true, data: result, endpoint: req.endpoint });
      } catch (error) {
        errors.push({ success: false, error, endpoint: req.endpoint });
        results.push({ success: false, error, endpoint: req.endpoint });
      }
    }

    if (errors.length > 0) {
      console.warn(`[API] Batch request: ${errors.length}/${requests.length} requests failed`);
    }

    return { results, errors, successful: requests.length - errors.length };
  }

  /**
   * CACHE MANAGEMENT
   */

  _isCacheValid(cacheKey) {
    if (!this.cache.has(cacheKey)) return false;
    const expiry = this.cacheExpiry.get(cacheKey);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(cacheKey);
      this.cacheExpiry.delete(cacheKey);
      return false;
    }
    return true;
  }

  clearCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
      this.cacheExpiry.clear();
      console.log('[API] Cache cleared');
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
    console.log(`[API] Cache cleared for pattern: ${pattern}`);
  }

  /**
   * LOADING STATE TRACKING
   */

  isLoading(endpoint = null) {
    if (!endpoint) return this.loadingState.size > 0;
    return Array.from(this.loadingState.keys()).some(key => key.includes(endpoint));
  }

  getLoadingState() {
    return {
      isLoading: this.loadingState.size > 0,
      endpoints: Array.from(this.loadingState.keys()),
      count: this.loadingState.size
    };
  }

  /**
   * EVENT LISTENERS - Global state observation
   */

  onLoading(callback) {
    this.listeners.loading.push(callback);
  }

  onError(callback) {
    this.listeners.error.push(callback);
  }

  onSuccess(callback) {
    this.listeners.success.push(callback);
  }

  onRetry(callback) {
    this.listeners.retry.push(callback);
  }

  _broadcastLoading(endpoint, isLoading) {
    this.listeners.loading.forEach(cb => cb(endpoint, isLoading));
  }

  _broadcastError(endpoint, error) {
    this.listeners.error.forEach(cb => cb(endpoint, error));
  }

  _broadcastSuccess(endpoint, data) {
    this.listeners.success.forEach(cb => cb(endpoint, data));
  }

  _broadcastRetry(endpoint, attempt, total, error) {
    this.listeners.retry.forEach(cb => cb(endpoint, attempt, total, error));
  }

  /**
   * RATE LIMITING & THROTTLING
   */

  async _rateLimit() {
    const now = Date.now();
    if (this.lastRequestTime && now - this.lastRequestTime < this.rateLimitDelay) {
      await new Promise(resolve =>
        setTimeout(resolve, this.rateLimitDelay - (now - this.lastRequestTime))
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * OFFLINE DETECTION
   */

  _handleOnline() {
    this.isOnline = true;
    console.log('[API] Network restored');
    this.listeners.error.length > 0 && this._broadcastSuccess('network', 'restored');
  }

  _handleOffline() {
    this.isOnline = false;
    console.log('[API] Network lost');
  }

  /**
   * DEBUGGING & MONITORING
   */

  getStats() {
    return {
      cacheSize: this.cache.size,
      loadingCount: this.loadingState.size,
      isOnline: this.isOnline,
      cacheKeys: Array.from(this.cache.keys()),
      loadingEndpoints: Array.from(this.loadingState.keys())
    };
  }

  logStats() {
    const stats = this.getStats();
    console.table(stats);
  }
}

/**
 * CUSTOM ERROR CLASS
 */
class APIError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', status = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status
    };
  }
}

// Initialize global API service instance
const apiService = new APIService({
  baseURL: 'http://localhost:5000',
  timeout: 15000,
  retryAttempts: 1,
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  rateLimitDelay: 100
});

// Add diagnostic info to window for debugging
window.apiDiagnostics = {
  testFetch: async function() {
    console.log('=== Testing Data File Access ===');
    const files = [
      '/assets/data/publications.json',
      '/assets/data/news.json',
      '/assets/data/projects.json',
      '/assets/data/blog.json',
      '/assets/data/upcoming.json',
      '/assets/data/skills.json'
    ];
    
    for (const file of files) {
      try {
        console.log(`Testing: ${file}`);
        const response = await fetch(file);
        console.log(`✓ ${file}: ${response.status} ${response.ok ? 'OK' : 'FAILED'}`);
        if (!response.ok) {
          console.log(`  Error: HTTP ${response.status}`);
        }
      } catch (error) {
        console.error(`✗ ${file}: ${error.message}`);
      }
    }
  },
  showStatus: function() {
    console.log('=== API Service Status ===');
    console.log('Base URL:', this.baseURL);
    console.log('Protocol:', window.location.protocol);
    console.log('Host:', window.location.host);
    console.log('API Online:', apiService.isOnline);
  }
};

// Make it easily accessible in console
console.log('Diagnostic tools available: window.apiDiagnostics.testFetch() and window.apiDiagnostics.showStatus()');

/**
 * GLOBAL ERROR HANDLING
 */
apiService.onError((endpoint, error) => {
  console.error(`[API Error] ${endpoint}:`, error);
  showNotification({
    type: 'error',
    title: 'Error',
    message: error.message,
    code: error.code,
    duration: 5000
  });
});

apiService.onRetry((endpoint, attempt, total, error) => {
  console.warn(`[API Retry] ${endpoint} (${attempt}/${total})`);
});

// Export for use in other modules
window.apiService = apiService;
window.APIError = APIError;
