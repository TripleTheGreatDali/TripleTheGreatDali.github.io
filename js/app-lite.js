/**
 * ULTRA-FAST APPLICATION
 * Lightweight, responsive, optimized for GitHub Pages
 * Combined core functionality for minimal HTTP requests
 */

// ==== GLOBAL CACHE ====
const dataCache = {};

// ==== INSTANT INITIALIZATION ====
document.addEventListener('DOMContentLoaded', async () => {
  // Setup core functions immediately (no delays)
  setupNav();
  setupMobile();
  setupScroll();
  
  // Load data in parallel - fail gracefully
  Promise.all([
    apiService.get('publications.json').then(d => (dataCache.publications = d)),
    apiService.get('projects.json').then(d => (dataCache.projects = d)),
    apiService.get('blog.json').then(d => (dataCache.blog = d)),
    apiService.get('news.json').then(d => (dataCache.news = d)),
    apiService.get('skills.json').then(d => (dataCache.skills = d)),
    apiService.get('upcoming.json').then(d => (dataCache.upcoming = d)),
    apiService.get('education.json').then(d => (dataCache.education = d))
  ]).then(() => {
    // Render sections only when all data is ready
    renderServices();
    renderPublications();
    renderProjects();
    renderBlog();
    renderNews();
    renderUpcoming();
    document.body.style.opacity = '1';
  }).catch(err => {
    console.error('Data loading issue:', err);
    document.body.style.opacity = '1'; // Show page anyway
  });
});

// ==== NAVIGATION ====
function setupNav() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle) return;
  
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('active'));
  });
}

// ==== MOBILE MENU ====
function setupMobile() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;
  
  window.addEventListener('resize', () => {
    const nav = document.querySelector('.nav-links');
    if (window.innerWidth > 768 && nav) nav.classList.remove('active');
  });
}

// ==== SMOOTH SCROLL ====
function setupScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const elem = document.querySelector(href);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ==== RENDER SECTIONS ====

// Services data (hardcoded for instant rendering)
const servicesData = [
  {
    icon: "🧠",
    title: "AI Research & Development",
    description: "Cutting-edge research in machine learning, deep learning, and computer vision. Transforming academic innovations into market-ready solutions."
  },
  {
    icon: "🏥",
    title: "Medical AI Solutions",
    description: "Advanced AI systems for medical imaging, surgical tool detection, and healthcare automation. Precision-driven solutions for modern medicine."
  },
  {
    icon: "🔍",
    title: "Computer Vision Systems",
    description: "State-of-the-art object detection, image segmentation, and visual recognition systems for industrial and commercial applications."
  },
  {
    icon: "⚡",
    title: "AI Consulting & Integration",
    description: "Expert guidance on integrating AI into your business. From strategy to deployment, we help you leverage AI for growth."
  },
  {
    icon: "📊",
    title: "Custom AI Models",
    description: "Tailored machine learning models designed specifically for your business needs. From concept to production-ready solutions."
  },
  {
    icon: "🌐",
    title: "International AI Solutions",
    description: "Serving global markets with AI products and research. Delivering world-class AI technology across borders."
  }
];

function renderServices() {
  const container = document.getElementById('services-container');
  if (!container) return;
  
  container.innerHTML = servicesData.map(service => `
    <div class="service-card">
      <div class="service-icon">${service.icon}</div>
      <h3>${esc(service.title)}</h3>
      <p>${esc(service.description)}</p>
    </div>
  `).join('');
}

function renderPublications() {
  if (!dataCache.publications) return;
  const container = document.getElementById('publications-container');
  if (!container) return;
  
  container.innerHTML = dataCache.publications.map(pub => `
    <div class="card">
      <h3>${esc(pub.title)}</h3>
      <p class="venue">${esc(pub.journal || pub.conference)}</p>
      <p class="year">${pub.year}</p>
      ${pub.doi ? `<a href="${pub.doi}" target="_blank">Read</a>` : ''}
    </div>
  `).join('');
}

function renderProjects() {
  if (!dataCache.projects) return;
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  container.innerHTML = dataCache.projects.map(proj => `
    <div class="card">
      <h3>${esc(proj.title)}</h3>
      <p>${esc(proj.description)}</p>
      ${proj.technologies ? `<div class="tech-tags">${proj.technologies.slice(0, 4).map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}</div>` : ''}
      ${proj.github ? `<a href="${proj.github}" target="_blank">View Project</a>` : ''}
    </div>
  `).join('');
}

function renderBlog() {
  if (!dataCache.blog) return;
  const container = document.getElementById('blog-container');
  if (!container) return;
  
  container.innerHTML = dataCache.blog.map(post => `
    <div class="card">
      <h3>${esc(post.title)}</h3>
      <p class="date">${post.date}</p>
      <p>${esc(post.excerpt)}</p>
    </div>
  `).join('');
}

function renderNews() {
  if (!dataCache.news) return;
  const container = document.getElementById('news-container');
  if (!container) return;
  
  container.innerHTML = dataCache.news.map(item => `
    <div class="card">
      <p class="date">${item.date}</p>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.content)}</p>
    </div>
  `).join('');
}

function renderUpcoming() {
  if (!dataCache.upcoming) return;
  const container = document.getElementById('upcoming-container');
  if (!container) return;
  
  container.innerHTML = dataCache.upcoming.map(item => `
    <div class="card">
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
    </div>
  `).join('');
}

// ==== UTILITIES ====
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
