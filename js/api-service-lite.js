/**
 * ULTRA-LIGHTWEIGHT API SERVICE
 * Direct fetch from CDN - No unnecessary overhead
 * Max 3KB minified | Zero dependencies | Sub-100ms loads
 */

const apiService = {
  cdnBase: '/assets/data',
  cache: new Map(),
  _loadingPromises: new Map(),
  timeout: 3000,

  async get(filename) {
    const cacheKey = `get:${filename}`;
    
    // Return cached data immediately
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Return existing promise if loading
    if (this._loadingPromises.has(cacheKey)) {
      return this._loadingPromises.get(cacheKey);
    }

    // Fetch with timeout
    const promise = this._fetchWithTimeout(`${this.cdnBase}/${filename}`, this.timeout)
      .then(data => {
        this.cache.set(cacheKey, data);
        this._loadingPromises.delete(cacheKey);
        return data;
      })
      .catch(err => {
        this._loadingPromises.delete(cacheKey);
        console.error(`Failed to load ${filename}:`, err.message);
        return null;
      });

    this._loadingPromises.set(cacheKey, promise);
    return promise;
  },

  async _fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(id);
    }
  },

  batch(files) {
    return Promise.all(files.map(f => this.get(f)));
  },

  clear() {
    this.cache.clear();
    this._loadingPromises.clear();
  }
};
