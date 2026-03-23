/**
 * MODERN PORTFOLIO - CORE JAVASCRIPT  
 * Ultra-minimal, ES6+, Production-ready
 */

class Portfolio {
  constructor() {
    this.basePath = '/assets/data/';
    this.data = {};
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.render();
      this.setupEventDelegation();
    } catch (error) {
      console.error('Portfolio initialization failed:', error);
      this.showFallback();
    }
  }

  /**
   * Load all data files in parallel
   */
  async loadData() {
    const files = ['education.json', 'publications.json', 'projects.json', 'research.json'];
    const promises = files.map(file =>
      fetch(`${this.basePath}${file}`)
        .then(r => r.json())
        .catch(() => ({ error: `Failed to load ${file}` }))
    );

    const [education, publications, projects, research] = await Promise.all(promises);
    
    this.data = {
      education: education || [],
      publications: publications || [],
      projects: projects || [],
      research: research || []
    };
  }

  /**
   * Render all data sections
   */
  render() {
    this.renderEducation();
    this.renderPublications();
    this.renderProjects();
    this.renderResearch();
  }

  /**
   * Render education timeline
   */
  renderEducation() {
    const container = document.getElementById('education-content');
    if (!container || !this.data.education) return;

    container.innerHTML = this.data.education.map(item => `
      <div class="timeline-item">
        <span class="timeline-year">${item.year}</span>
        <h3>${item.title}</h3>
        <p>${item.institution || ''}</p>
        ${item.description ? `<p>${item.description}</p>` : ''}
      </div>
    `).join('');
  }

  /**
   * Render publications grid
   */
  renderPublications() {
    const container = document.getElementById('publications-content');
    if (!container || !this.data.publications) return;

    container.innerHTML = this.data.publications.map(item => `
      <article class="card">
        <span class="timeline-year">${item.year}</span>
        <h3>${item.title}</h3>
        <p>${item.venue || ''}</p>
        <p>${item.description || ''}</p>
        ${item.tags ? `
          <div class="card-meta">
            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
        ${item.links ? `
          <div class="card-meta" style="margin-top: 1rem;">
            ${item.links.map(link => `<a href="${link.url}" target="_blank">${link.label}</a>`).join('')}
          </div>
        ` : ''}
      </article>
    `).join('');
  }

  /**
   * Render projects grid
   */
  renderProjects() {
    const container = document.getElementById('projects-content');
    if (!container || !this.data.projects) return;

    container.innerHTML = this.data.projects.map(item => `
      <article class="card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.technologies ? `
          <div class="card-meta">
            ${item.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
          </div>
        ` : ''}
        ${item.link ? `<a href="${item.link}" target="_blank">View Project →</a>` : ''}
      </article>
    `).join('');
  }

  /**
   * Render research grid
   */
  renderResearch() {
    const container = document.getElementById('research-content');
    if (!container || !this.data.research) return;

    container.innerHTML = this.data.research.map(item => `
      <article class="card">
        <h3>${item.title}</h3>
        <p>${item.focus}</p>
        ${item.description ? `<p>${item.description}</p>` : ''}
        ${item.tags ? `
          <div class="card-meta">
            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `).join('');
  }

  /**
   * Setup event delegation for dynamic content
   */
  setupEventDelegation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Close nav on link click (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        // Nav will naturally scroll away on mobile
      });
    });
  }

  /**
   * Fallback UI if data loading fails
   */
  showFallback() {
    ['education-content', 'publications-content', 'projects-content', 'research-content']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<p>Loading content...</p>';
      });
  }
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Portfolio());
} else {
  new Portfolio();
}

/**
 * Performance Monitoring (optional, minimal)
 */
if (window.performanceMonitor) {
  window.addEventListener('load', () => {
    const perf = performance.getEntriesByType('navigation')[0];
    if (perf) {
      console.log(`⚡ Load time: ${Math.round(perf.loadEventEnd - perf.fetchStart)}ms`);
    }
  });
}
