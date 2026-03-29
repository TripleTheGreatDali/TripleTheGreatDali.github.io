/**
 * GITHUB-NATIVE API SERVICE LAYER
 * Optimized for running entirely from GitHub Pages + GitHub Actions
 * - No local backend server required
 * - Uses GitHub raw content CDN for static files
 * - Uses GitHub API + Actions for dynamic operations
 * - Client-side caching with intelligent fallback
 */

class GitHubAPIService {
  constructor(config = {}) {
    // GitHub repository config
    this.owner = config.owner || 'TripleTheGreatDali';
    this.repo = config.repo || 'TripleTheGreatDali.github.io';
    this.branch = config.branch || 'master';
    this.token = config.token || null; // Optional GitHub token for higher rate limits
    
    // GitHub API endpoints
    this.githubAPI = 'https://api.github.com';
    this.rawContentCDN = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}`;
    
    // Request config
    this.timeout = config.timeout || 8000;
    this.cacheDuration = config.cacheDuration || 5 * 60 * 1000; // 5 minutes
    this.retryAttempts = 1;
    this.retryDelay = 500;
    
    // State management
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.loadingState = new Map();
    this.isOnline = navigator.onLine;
    
    // Event listeners
    this.listeners = {
      loading: [],
      error: [],
      success: [],
      retry: []
    };
    
    // Request tracking
    this.activeRequests = new Map();
    this.requestId = 0;
    this.lastRequestTime = 0;
    this.rateLimitDelay = 50;
    
    // Offline detection
    window.addEventListener('online', () => this._handleOnline());
    window.addEventListener('offline', () => this._handleOffline());
    
    console.log(`✅ GitHub API Service initialized`);
    console.log(`   Repository: ${this.owner}/${this.repo}/${this.branch}`);
    console.log(`   CDN: ${this.rawContentCDN}`);
  }

  /**
   * MAIN REQUEST METHOD - All API calls go through here
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      useCache = true,
      forceFresh = false,
      timeout = this.timeout,
      retry = this.retryAttempts
    } = options;

    const cacheKey = `${method}:${endpoint}`;
    const requestId = ++this.requestId;

    try {
      // Check cache first (unless forceFresh)
      if (!forceFresh && useCache && method === 'GET' && this._isCacheValid(cacheKey)) {
        console.log(`[API] Cache HIT: ${endpoint}`);
        this._broadcastSuccess(endpoint, this.cache.get(cacheKey));
        return this.cache.get(cacheKey);
      }

      // Check if already loading
      if (this.loadingState.has(cacheKey)) {
        console.log(`[API] Returning existing request: ${endpoint}`);
        return this.activeRequests.get(cacheKey);
      }

      // Rate limiting
      await this._rateLimit();

      // Mark as loading
      this.loadingState.set(cacheKey, true);
      this._broadcastLoading(endpoint, true);

      // Make request with retry logic
      let lastError;
      for (let attempt = 1; attempt <= retry; attempt++) {
        try {
          const response = await this._makeRequest(
            endpoint,
            { method, body, headers, timeout }
          );

          // Cache successful GET response
          if (method === 'GET') {
            this.cache.set(cacheKey, response.data);
            this.cacheExpiry.set(cacheKey, Date.now() + this.cacheDuration);
          }

          this._broadcastSuccess(endpoint, response.data);
          return response.data;
        } catch (error) {
          lastError = error;
          if (attempt < retry) {
            const delay = this.retryDelay * Math.pow(2, attempt - 1);
            console.warn(`[API] Retry ${attempt}/${retry} for ${endpoint}`, error.message);
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
    }
  }

  /**
   * Make actual HTTP request with timeout
   */
  async _makeRequest(endpoint, options, requestId) {
    const { method, body, headers, timeout } = options;

    // Build URL - use raw CDN for static files, GitHub API for dynamic operations
    let url;
    if (endpoint.startsWith('/api/')) {
      url = `${this.githubAPI}/repos/${this.owner}/${this.repo}${endpoint}`;
    } else {
      url = `${this.rawContentCDN}${endpoint}`;
    }

    console.log(`[API] ${method} ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          ...headers
        },
        signal: controller.signal
      };

      if (this.token) {
        config.headers['Authorization'] = `token ${this.token}`;
      }

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}` };
        }
        const error = new Error(errorData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      console.log(`[API] ✓ ${url}`, data);
      return { status: response.status, data };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 'TIMEOUT');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * ERROR NORMALIZATION
   */
  _normalizeError(error, endpoint) {
    if (error instanceof APIError) return error;

    let code = 'UNKNOWN_ERROR';
    let message = error.message || 'An unknown error occurred';

    if (error.name === 'AbortError') {
      code = 'TIMEOUT';
      message = 'Request timeout - server may be slow or unavailable';
    } else if (!this.isOnline) {
      code = 'OFFLINE';
      message = 'You are currently offline';
    } else if (error.status === 404) {
      code = 'NOT_FOUND';
      message = `Resource not found: ${endpoint}`;
    } else if (error.status === 429) {
      code = 'RATE_LIMIT';
      message = 'Rate limited - please try again later';
    } else if (error.status === 500) {
      code = 'SERVER_ERROR';
      message = 'GitHub server error - please try again later';
    }

    return new APIError(message, code, error.status);
  }

  /**
   * CONVENIENCE METHODS
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * GITHUB-SPECIFIC METHODS
   */

  /**
   * Submit contact form via GitHub Actions webhook
   */
  async submitContactForm(name, email, message) {
    console.log(`[API] Submitting contact form via GitHub Actions...`);
    
    try {
      const response = await fetch(
        `${this.githubAPI}/repos/${this.owner}/${this.repo}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${this.token || 'public'}`
          },
          body: JSON.stringify({
            event_type: 'form-submission',
            client_payload: {
              name: String(name).substring(0, 100),
              email: String(email).substring(0, 100),
              message: String(message).substring(0, 5000)
            }
          })
        }
      );

      if (!response.ok) {
        console.warn('Using alternative contact submission method...');
        return this._submitContactFormFallback(name, email, message);
      }

      console.log(`✅ Contact form submitted to GitHub Actions`);
      return {
        success: true,
        message: 'Your message has been received! We will get back to you soon.',
        submittedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return this._submitContactFormFallback(name, email, message);
    }
  }

  /**
   * Fallback: Submit contact via GitHub Issue (no token required)
   */
  async _submitContactFormFallback(name, email, message) {
    console.log(`[API] Using GitHub Issues as fallback...`);
    
    try {
      const response = await fetch(
        `${this.githubAPI}/repos/${this.owner}/${this.repo}/issues`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            title: `📧 Contact: ${name}`,
            body: `**From:** ${name} <${email}>\n\n**Message:**\n${message}\n\n---\n*Submitted via portfolio contact form*`,
            labels: ['contact-form', 'auto']
          })
        }
      );

      if (response.ok) {
        console.log(`✅ Contact form submitted via GitHub Issue`);
        return {
          success: true,
          message: 'Your message has been received! We will get back to you soon.',
          method: 'GitHub Issue',
          submittedAt: new Date().toISOString()
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('All contact methods failed:', error);
      throw new APIError('Failed to submit contact form', 'CONTACT_FAILED');
    }
  }

  /**
   * Submit data update (requires token)
   */
  async submitDataUpdate(dataType, newData) {
    if (!this.token) {
      throw new APIError('GitHub token required for data updates', 'NO_TOKEN');
    }

    console.log(`[API] Submitting ${dataType} update...`);

    try {
      const filePath = `assets/data/${dataType}.json`;
      const fileResponse = await fetch(
        `${this.githubAPI}/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        { headers: { 'Authorization': `token ${this.token}` } }
      );
      
      if (!fileResponse.ok) {
        throw new Error('Failed to fetch current file');
      }

      const fileData = await fileResponse.json();
      const currentSha = fileData.sha;

      const updateResponse = await fetch(
        `${this.githubAPI}/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Update ${dataType}: ${new Date().toISOString()}`,
            content: btoa(JSON.stringify(newData, null, 2)),
            sha: currentSha
          })
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update file');
      }

      console.log(`✅ ${dataType} updated successfully`);
      return await updateResponse.json();
    } catch (error) {
      console.error(`Failed to update ${dataType}:`, error);
      throw error;
    }
  }

  /**
   * BATCH REQUEST
   */
  async batch(requests) {
    const promises = requests.map(req =>
      this.request(req.endpoint, req.options)
        .then(data => ({ success: true, data, endpoint: req.endpoint }))
        .catch(error => ({ success: false, error, endpoint: req.endpoint }))
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => !r.success);

    console.log(`[API] Batch: ${results.length - errors.length}/${requests.length} succeeded`);
    return { results, errors };
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
   * LOADING STATE
   */
  isLoading(endpoint = null) {
    if (!endpoint) return this.loadingState.size > 0;
    return Array.from(this.loadingState.keys()).some(key => key.includes(endpoint));
  }

  /**
   * EVENT LISTENERS
   */
  onLoading(callback) { this.listeners.loading.push(callback); }
  onError(callback) { this.listeners.error.push(callback); }
  onSuccess(callback) { this.listeners.success.push(callback); }
  onRetry(callback) { this.listeners.retry.push(callback); }

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
   * RATE LIMITING
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
    this._broadcastSuccess('network', 'restored');
  }

  _handleOffline() {
    this.isOnline = false;
    console.log('[API] Network lost - using cache');
  }

  /**
   * DEBUGGING & STATS
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      loadingCount: this.loadingState.size,
      isOnline: this.isOnline,
      repository: `${this.owner}/${this.repo}`,
      branch: this.branch
    };
  }

  logStats() {
    console.table(this.getStats());
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

// ==================== INITIALIZATION ====================

// Initialize global GitHub API service
const apiService = new GitHubAPIService({
  owner: 'TripleTheGreatDali',
  repo: 'TripleTheGreatDali.github.io',
  branch: 'master',
  timeout: 8000,
  cacheDuration: 5 * 60 * 1000
});

// Global error handler
apiService.onError((endpoint, error) => {
  console.error(`[API Error] ${endpoint}:`, error);
  if (typeof showNotification === 'function') {
    showNotification({
      type: 'error',
      title: 'Error',
      message: error.message,
      code: error.code,
      duration: 5000
    });
  }
});

// Diagnostic tools
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
        const response = await fetch(file);
        console.log(`✓ ${file}: ${response.status}`);
      } catch (error) {
        console.error(`✗ ${file}: ${error.message}`);
      }
    }
  },
  showStatus: function() {
    apiService.logStats();
  }
};

console.log('✅ GitHub-Native API Service loaded and ready');
console.log('📍 Use window.apiDiagnostics.testFetch() to test data access');
