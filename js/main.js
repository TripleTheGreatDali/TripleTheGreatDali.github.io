/**
 * MAIN APPLICATION CONTROLLER
 * Uses centralized API service, loading manager, and notification system
 * All data loading and UI interactions flow through this module
 */

// Global data cache
const dataCache = {
  publications: null,
  news: null,
  projects: null,
  blog: null,
  upcoming: null,
  skills: null
};

// Load all data and initialize the portfolio
document.addEventListener('DOMContentLoaded', async () => {
  // Add immediate debug output
  const debugEl = document.createElement('div');
  debugEl.id = 'debug-status';
  debugEl.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: #0d9;
    padding: 10px 15px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
    z-index: 10000;
    max-width: 300px;
    word-wrap: break-word;
  `;
  debugEl.textContent = '⏳ Loading...';
  document.body.appendChild(debugEl);
  
  const updateDebug = (msg) => {
    debugEl.textContent = msg;
    console.log('[DEBUG]', msg);
  };
  
  // Safety timeout - force show page after 8 seconds
  const forceShowTimeout = setTimeout(() => {
    console.error('[App] TIMEOUT: Forcing page to show after 8 seconds');
    updateDebug('⚠️ Timeout - showing page anyway');
    loadingManager.hideAll();
  }, 8000);
  
  try {
    console.log('[App] Initializing application...');
    console.log('[App] Window location:', window.location.href);
    console.log('[App] Protocol:', window.location.protocol);
    updateDebug('🚀 Initializing...');
    
    // Setup core functionality
    setupMobileMenu();
    setupNavigation();
    setupContactForm();
    setupScrollAnimations();
    updateDebug('✓ Core setup done');
    
    // Setup API service listeners for global error handling
    setupAPIServiceListeners();
    updateDebug('✓ API listeners ready');
    
    // Load all data in parallel
    console.log('[App] Loading portfolio data...');
    loadingManager.show('app-init', { 
      message: 'Loading portfolio data...' 
    });
    updateDebug('⏳ Loading data files...');
    
    try {
      await loadAllData();
      updateDebug('✓ Data loaded!');
    } catch (loadError) {
      console.error('[App] Data loading failed, attempting recovery:', loadError);
      updateDebug('⚠️ Data load failed, showing page anyway');
      // Continue anyway, show page with whatever data loaded
    }
    
    clearTimeout(forceShowTimeout);
    loadingManager.hide('app-init');
    updateDebug('✓ Ready!');
    
    console.log('[App] Application initialized successfully');
    notificationManager.success('Welcome!', 'Portfolio loaded successfully');
    
    // Remove debug after 3 seconds if successful
    setTimeout(() => {
      if (debugEl.textContent === '✓ Ready!') {
        debugEl.remove();
      }
    }, 3000);
  } catch (error) {
    console.error('[App] Fatal error during initialization:', error);
    updateDebug('❌ Error: ' + (error.message || 'Unknown error'));
    clearTimeout(forceShowTimeout);
    loadingManager.hideAll();
    notificationManager.error(
      'Application Error',
      'Failed to initialize application. Check console for details.',
      error.code
    );
  }
});

/**
 * Setup API service global listeners
 */
function setupAPIServiceListeners() {
  // Loading states are handled by loadingManager automatically
  apiService.onLoading((endpoint, isLoading) => {
    if (isLoading && endpoint.includes('/api/')) {
      loadingManager.show(endpoint, { message: 'Loading...' });
    } else {
      loadingManager.hide(endpoint);
    }
  });

  // Errors are already shown as notifications by apiService
  
  // Retry feedback
  apiService.onRetry((endpoint, attempt, total, error) => {
    console.warn(`[API Retry] ${endpoint} attempt ${attempt}/${total}`);
  });
}

/**
 * Load all portfolio data in parallel
 */
async function loadAllData() {
  try {
    console.log('[App] Starting batch data load...');
    const { results, errors } = await apiService.batch([
      { endpoint: '/assets/data/publications.json', options: { useCache: true } },
      { endpoint: '/assets/data/news.json', options: { useCache: true } },
      { endpoint: '/assets/data/projects.json', options: { useCache: true } },
      { endpoint: '/assets/data/blog.json', options: { useCache: true } },
      { endpoint: '/assets/data/upcoming.json', options: { useCache: true } },
      { endpoint: '/assets/data/skills.json', options: { useCache: true } }
    ]);

    console.log('[App] Batch complete. Results:', { total: results.length, failed: errors.length });

    // Process results
    let successCount = 0;
    for (const result of results) {
      if (result.success) {
        console.log('[App] Successfully loaded:', result.endpoint);
        successCount++;
        if (result.endpoint.includes('publications')) {
          dataCache.publications = result.data;
          loadPublications();
        } else if (result.endpoint.includes('news')) {
          dataCache.news = result.data;
          loadNews();
        } else if (result.endpoint.includes('projects')) {
          dataCache.projects = result.data;
          loadProjects();
        } else if (result.endpoint.includes('blog')) {
          dataCache.blog = result.data;
          loadBlog();
        } else if (result.endpoint.includes('upcoming')) {
          dataCache.upcoming = result.data;
          loadUpcomingResearch();
        } else if (result.endpoint.includes('skills')) {
          dataCache.skills = result.data;
        }
      }
    }

    // Report on errors
    if (errors.length > 0) {
      console.warn(`[App] ${errors.length} data source(s) failed to load`);
      errors.forEach(err => {
        console.error(`[App] Failed to load ${err.endpoint}:`, err.error?.message || err.error);
      });
    }

    console.log('[App] Data loading complete. Success:', successCount, 'Failed:', errors.length);
    
    if (successCount === 0 && errors.length > 0) {
      throw new Error('Failed to load any data files. Check console for details.');
    }
  } catch (error) {
    console.error('[App] Batch data loading failed:', error);
    throw error;
  }
}

/**
 * MOBILE MENU SETUP
 */
function setupMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle) return;
  
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * SETUP NAVIGATION ACTIVE STATES
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * LOAD PUBLICATIONS
 */
function loadPublications() {
  try {
    const publications = dataCache.publications;
    if (!publications) {
      throw new Error('No publications data available');
    }

    const container = document.getElementById('publications-container');
    if (!container) return;

    function renderPublications(year = 'all') {
      let filtered = publications;
      
      if (year !== 'all') {
        filtered = publications.filter(pub => pub.year === parseInt(year));
      }
      
      if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">No publications for this year</div>';
        return;
      }
      
      const html = filtered.map(pub => `
        <div class="publication-card" role="article">
          <div class="publication-year">${pub.year}</div>
          <div class="publication-title">${this._escape(pub.title)}</div>
          <div class="publication-venue">${this._escape(pub.journal || pub.conference)}</div>
          <div class="publication-abstract">${this._escape(pub.abstract)}</div>
          <div class="publication-tags">
            ${pub.tags.map(tag => `<span class="publication-tag">${this._escape(tag)}</span>`).join('')}
          </div>
          ${pub.doi ? `<div class="publication-links" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);"><a href="${pub.doi}" target="_blank" rel="noopener noreferrer" title="Open article in new window" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; background: linear-gradient(135deg, var(--accent-neon), rgba(31, 78, 121, 0.8)); color: var(--bg-dark); border-radius: 8px; text-decoration: none; font-weight: 700; transition: all 0.3s ease; cursor: pointer; font-size: 0.95em; box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);"><span style="font-size: 1.1em;">📄</span><span>Read Article</span><span style="font-size: 0.85em;">↗</span></a></div>` : ''}
        </div>
      `).join('');
      
      container.innerHTML = html;
    }

    // Bind render function with 'this' context
    renderPublications = renderPublications.bind({
      _escape: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    });
    
    renderPublications();
    
    // Filter buttons
    document.querySelectorAll('.publications-filter .filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.publications-filter .filter-btn').forEach(b => 
          b.classList.remove('active')
        );
        this.classList.add('active');
        renderPublications(this.dataset.filter);
      });
    });
    
    console.log(`[App] Loaded ${publications.length} publications`);
  } catch (error) {
    console.error('[App] Error loading publications:', error);
    notificationManager.error(
      'Publications Error',
      'Failed to load publications',
      error.code
    );
  }
}

/**
 * LOAD UPCOMING RESEARCH
 */
function loadUpcomingResearch() {
  try {
    const upcoming = dataCache.upcoming;
    if (!upcoming) {
      throw new Error('No upcoming research data available');
    }

    const container = document.getElementById('upcoming-container');
    if (!container) return;

    const html = upcoming.map(item => `
      <div class="upcoming-card" role="article">
        <div class="status-badge">${this._escape(item.status)}</div>
        <h3>${this._escape(item.title)}</h3>
        <p>${this._escape(item.description)}</p>
        <div class="publication-tags">
          ${item.keywords.map(kw => `<span class="publication-tag">${this._escape(kw)}</span>`).join('')}
        </div>
        ${item.targetConference ? `<p style="margin-top: 12px; color: var(--accent-neon);"><strong>Target:</strong> ${this._escape(item.targetConference)}</p>` : ''}
        ${item.expectedDate ? `<p style="color: var(--text-secondary);">Expected: ${this._escape(item.expectedDate)}</p>` : ''}
      </div>
    `).join('');
    
    container.innerHTML = html;
    console.log(`[App] Loaded ${upcoming.length} upcoming research items`);
  } catch (error) {
    console.error('[App] Error loading upcoming research:', error);
  }
}

/**
 * LOAD NEWS & UPDATES
 */
function loadNews() {
  try {
    const news = dataCache.news;
    if (!news) {
      throw new Error('No news data available');
    }

    const container = document.getElementById('news-container');
    if (!container) return;

    const html = news.map((item, index) => `
      <div class="news-item" style="animation-delay: ${index * 0.1}s; cursor: pointer;" 
           onclick="window.location.href='pages/news-detail.html?id=${index}'"
           role="article" tabindex="0"
           onkeypress="if(event.key==='Enter') window.location.href='pages/news-detail.html?id=${index}'">
        <div class="news-content">
          <div class="news-date">${this._escape(item.date)} • ${item.icon} ${this._escape(item.category)}</div>
          <div class="news-title">${this._escape(item.title)}</div>
          <div class="news-description">${this._escape(item.description)}</div>
          <span style="color: #1F4E79; font-weight: 600; margin-top: 10px; display: inline-block;">Read More →</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
    console.log(`[App] Loaded ${news.length} news items`);
  } catch (error) {
    console.error('[App] Error loading news:', error);
  }
}

/**
 * LOAD PROJECTS
 */
function loadProjects() {
  try {
    const projects = dataCache.projects;
    if (!projects) {
      throw new Error('No projects data available');
    }

    const container = document.getElementById('projects-container');
    if (!container) return;

    const html = projects.slice(0, 6).map(project => `
      <div class="project-card" role="article">
        <div class="project-image">${project.icon}</div>
        <div class="project-content">
          <h3 class="project-title">${this._escape(project.title)}</h3>
          <p class="project-description">${this._escape(project.description)}</p>
          <div class="project-tags">
            ${project.technologies.map(tech => `<span class="project-tag">${this._escape(tech)}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
            ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">Demo</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
    console.log(`[App] Loaded ${projects.length} projects`);
  } catch (error) {
    console.error('[App] Error loading projects:', error);
  }
}

/**
 * LOAD BLOG POSTS
 */
function loadBlog() {
  try {
    const blog = dataCache.blog;
    if (!blog) {
      throw new Error('No blog data available');
    }

    const container = document.getElementById('blog-container');
    if (!container) return;

    const html = blog.slice(0, 6).map((post, index) => `
      <div class="blog-card" style="cursor: pointer;" 
           onclick="window.location.href='pages/blog-post.html?id=${index}'"
           role="article" tabindex="0"
           onkeypress="if(event.key==='Enter') window.location.href='pages/blog-post.html?id=${index}'">
        <div class="blog-date">${this._escape(post.date)}</div>
        <div class="blog-title">${this._escape(post.title)}</div>
        <div class="blog-excerpt">${this._escape(post.excerpt)}</div>
        <a href="pages/blog-post.html?id=${index}" class="blog-readmore" onclick="event.stopPropagation();">Read More →</a>
      </div>
    `).join('');
    
    container.innerHTML = html;
    console.log(`[App] Loaded ${blog.length} blog posts`);
  } catch (error) {
    console.error('[App] Error loading blog:', error);
  }
}

/**
 * SETUP CONTACT FORM
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
}

/**
 * HANDLE CONTACT FORM SUBMISSION
 * Uses centralized API service with proper error handling
 */
async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  };

  // Validate data
  if (!data.name || !data.email || !data.message) {
    notificationManager.warning(
      'Validation Error',
      'Please fill in all fields'
    );
    return;
  }

  try {
    loadingManager.show('contact-submit', { message: 'Sending message...' });

    const response = await apiService.post('/api/contact', data, {
      timeout: 20000,
      retry: 2
    });

    loadingManager.hide('contact-submit');

    notificationManager.success(
      'Message Sent',
      'Thank you! Your message has been sent to contact@foylix.com. I\'ll get back to you soon.',
      'SUCCESS'
    );

    form.reset();
  } catch (error) {
    loadingManager.hide('contact-submit');

    if (!navigator.onLine) {
      notificationManager.error(
        'Network Error',
        'You are offline. Please check your connection and try again.',
        'OFFLINE'
      );
    } else if (error.code === 'TIMEOUT') {
      notificationManager.warning(
        'Request Timeout',
        'The request took too long. Your message may still have been received. Please try again if needed.',
        error.code
      );
    } else {
      notificationManager.error(
        'Send Failed',
        error.message || 'Failed to send your message. Please try again.',
        error.code
      );
    }

    console.error('[App] Contact submission error:', error);
  }
}

/**
 * SETUP SCROLL ANIMATIONS
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all cards
  document.querySelectorAll('.publication-card, .project-card, .blog-card, .upcoming-card, .timeline-item')
    .forEach(el => {
      observer.observe(el);
    });
}

/**
 * UTILITY HELPER FUNCTION
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
