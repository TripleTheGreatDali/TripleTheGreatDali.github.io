/**
 * ULTRA-FAST APPLICATION
 * Lightweight, responsive, optimized for GitHub Pages
 * Combined core functionality for minimal HTTP requests
 */

// ==== GLOBAL CACHE ====
const dataCache = {};
let productsData = [];

// ==== INSTANT INITIALIZATION ====
document.addEventListener('DOMContentLoaded', async () => {
  // Setup core functions immediately (no delays)
  setupNav();
  setupMobile();
  setupScroll();
  setupProductGallery();
  
  // Load data in parallel - fail gracefully
  Promise.all([
    apiService.get('publications.json').then(d => (dataCache.publications = d)),
    apiService.get('projects.json').then(d => (dataCache.projects = d)),
    apiService.get('blog.json').then(d => (dataCache.blog = d)),
    apiService.get('news.json').then(d => (dataCache.news = d)),
    apiService.get('skills.json').then(d => (dataCache.skills = d)),
    apiService.get('upcoming.json').then(d => (dataCache.upcoming = d)),
    apiService.get('education.json').then(d => (dataCache.education = d)),
    apiService.get('products.json').then(d => {
      productsData = d || [];
      return productsData;
    })
  ]).then(() => {
    // Render sections only when all data is ready
    renderServices();
    renderPublications();
    renderProjects();
    renderProductGallery();
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
    icon: "⚙️",
    title: "AI-Powered Operations",
    description: "Streamline and automate your business processes with intelligent AI systems. From workflow optimization to predictive maintenance."
  },
  {
    icon: "🤖",
    title: "Intelligent Automation",
    description: "Transform manual workflows into automated intelligent processes. Reduce costs and increase efficiency with AI-driven automation."
  },
  {
    icon: "👁️",
    title: "Computer Vision Solutions",
    description: "State-of-the-art visual recognition, object detection, and image analysis systems for industrial, medical, and commercial applications."
  },
  {
    icon: "📊",
    title: "Personal AI Analytics",
    description: "Custom AI-powered analytics dashboards and insights tailored to your business. Data-driven decisions made simple."
  },
  {
    icon: "🧠",
    title: "Deep Learning Systems",
    description: "Advanced neural network solutions for complex problem-solving. From pattern recognition to predictive modeling."
  },
  {
    icon: "🏥",
    title: "Medical AI Systems",
    description: "AI-powered medical imaging, surgical tool detection, and healthcare automation solutions for modern medicine."
  },
  {
    icon: "🔬",
    title: "Research & Development",
    description: "Cutting-edge AI research translating into market-ready products. Innovation backed by peer-reviewed publications."
  },
  {
    icon: "🌐",
    title: "Global AI Consulting",
    description: "Expert guidance on AI strategy, implementation, and integration. Serving clients worldwide with tailored solutions."
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
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  // Use cached data if available, otherwise show fallback
  if (!dataCache.projects || dataCache.projects.length === 0) {
    // Fallback products data
    const fallbackProducts = [
      {
        title: "Medical Image Segmentation",
        description: "Advanced CNN-based system for automated segmentation of medical images including CT scans, MRI, and X-ray images.",
        icon: "🏥",
        technologies: ["PyTorch", "U-Net", "Computer Vision"],
        github: "https://github.com/TripleTheGreatDali"
      },
      {
        title: "Hybrid Intelligence System",
        description: "Innovative approach combining symbolic AI reasoning with deep learning models for improved interpretability.",
        icon: "🧠",
        technologies: ["PyTorch", "Symbolic AI", "Deep Learning"],
        github: "https://github.com/TripleTheGreatDali"
      },
      {
        title: "Real-time Object Detection",
        description: "High-performance object detection system using YOLO for real-time applications with optimized edge inference.",
        icon: "🎯",
        technologies: ["YOLO", "TensorFlow", "Computer Vision"],
        github: "https://github.com/TripleTheGreatDali"
      },
      {
        title: "AI Model Benchmark Suite",
        description: "Automated benchmarking framework for comparing deep learning models across architectures and datasets.",
        icon: "📊",
        technologies: ["PyTorch", "TensorFlow", "Benchmarking"],
        github: "https://github.com/TripleTheGreatDali"
      },
      {
        title: "Transfer Learning Framework",
        description: "Comprehensive framework for leveraging pre-trained models with efficient fine-tuning strategies.",
        icon: "🔄",
        technologies: ["PyTorch", "Transfer Learning", "ResNet"],
        github: "https://github.com/TripleTheGreatDali"
      },
      {
        title: "Surgical Tool Detection",
        description: "Real-time YOLO-based detection system for surgical instruments in laparoscopic videos.",
        icon: "🔬",
        technologies: ["YOLO", "Medical Imaging", "Computer Vision"],
        github: "https://github.com/TripleTheGreatDali"
      }
    ];
    
    container.innerHTML = fallbackProducts.map(proj => `
      <div class="card product-card">
        <div class="product-icon">${proj.icon}</div>
        <h3>${esc(proj.title)}</h3>
        <p>${esc(proj.description)}</p>
        ${proj.technologies ? `<div class="tech-tags">${proj.technologies.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}</div>` : ''}
        ${proj.github ? `<a href="${proj.github}" target="_blank"><i class="fab fa-github"></i> View Project</a>` : ''}
      </div>
    `).join('');
    return;
  }
  
  container.innerHTML = dataCache.projects.map(proj => `
    <div class="card product-card">
      <div class="product-icon">${proj.icon || '📦'}</div>
      <h3>${esc(proj.title)}</h3>
      <p>${esc(proj.description)}</p>
      ${proj.technologies ? `<div class="tech-tags">${proj.technologies.slice(0, 4).map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}</div>` : ''}
      ${proj.github ? `<a href="${proj.github}" target="_blank"><i class="fab fa-github"></i> View Project</a>` : ''}
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

// ==== PRODUCT GALLERY FUNCTIONALITY ====
function setupProductGallery() {
  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      filterProducts(filter);
    });
  });
  
  // Modal close
  const modal = document.getElementById('product-modal');
  const closeBtn = document.querySelector('.modal-close');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function filterProducts(category) {
  const container = document.getElementById('product-gallery');
  if (!container) return;
  
  let filtered = productsData;
  if (category !== 'all') {
    filtered = productsData.filter(p => p.category === category);
  }
  
  renderProductCards(filtered);
}

function renderProductGallery() {
  renderProductCards(productsData);
}

function renderProductCards(products) {
  const container = document.getElementById('product-gallery');
  if (!container) return;
  
  if (!products || products.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:rgba(224,224,255,0.6);grid-column:1/-1;">No products available at the moment.</p>';
    return;
  }
  
  container.innerHTML = products.map(product => {
    const hasImage = product.image && product.image !== 'products/.png';
    const imageHtml = hasImage 
      ? `<img src="${product.image}" alt="${esc(product.name)}" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'><i class=\\'fas fa-box\\'></i></div>'">`
      : `<div class="product-image-placeholder"><i class="fas fa-box"></i></div>`;
    
    const badgeHtml = product.badge 
      ? `<span class="product-badge">${esc(product.badge)}</span>` 
      : '';
    
    const featuresHtml = product.features 
      ? product.features.slice(0, 3).map(f => `<span class="feature-tag">${esc(f)}</span>`).join('')
      : '';
    
    const stockHtml = product.inStock 
      ? `<div class="stock-status in-stock"><i class="fas fa-check-circle"></i> In Stock</div>`
      : `<div class="stock-status out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</div>`;
    
    return `
      <div class="product-card-new" onclick="openProductModal(${product.id})">
        ${badgeHtml}
        <div class="product-image-wrapper">
          ${imageHtml}
        </div>
        <div class="card-content">
          <p class="product-category">${esc(product.category)}</p>
          <h3>${esc(product.name)}</h3>
          <p class="product-description">${esc(product.description)}</p>
          <div class="product-features-preview">${featuresHtml}</div>
          <div class="product-footer">
            <div>
              <span class="product-price">${esc(product.price)}</span>
              <span class="product-price-note">${esc(product.priceNote || '')}</span>
              ${stockHtml}
            </div>
            <button class="view-details-btn" onclick="event.stopPropagation();openProductModal(${product.id})">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openProductModal(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  
  // Populate modal
  const hasImage = product.image && product.image !== 'products/.png';
  const imgEl = document.getElementById('modal-product-image');
  if (hasImage) {
    imgEl.src = product.image;
    imgEl.style.display = 'block';
    imgEl.onerror = function() {
      this.style.display = 'none';
      this.parentElement.innerHTML = '<div class="modal-image-placeholder"><i class="fas fa-box"></i><span>No Image Available</span></div>';
    };
  } else {
    imgEl.style.display = 'none';
    const wrapper = imgEl.parentElement;
    wrapper.innerHTML = '<div class="modal-image-placeholder"><i class="fas fa-box"></i><span>No Image Available</span></div>';
  }
  
  document.getElementById('modal-product-badge').textContent = product.badge || '';
  document.getElementById('modal-product-badge').style.display = product.badge ? 'inline-block' : 'none';
  document.getElementById('modal-product-name').textContent = product.name;
  document.getElementById('modal-product-category').textContent = product.category;
  document.getElementById('modal-product-description').textContent = product.description;
  
  const featuresList = document.getElementById('modal-product-features');
  if (product.features && product.features.length > 0) {
    featuresList.innerHTML = product.features.map(f => `<li>${esc(f)}</li>`).join('');
  } else {
    featuresList.innerHTML = '<li>Custom features available</li>';
  }
  
  document.getElementById('modal-product-price').textContent = product.price;
  document.getElementById('modal-product-price-note').textContent = product.priceNote || '';
  
  const linkEl = document.getElementById('modal-product-link');
  linkEl.href = product.orderLink || '#contact';
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==== NEWSLETTER HANDLER ====
function handleNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
  e.target.reset();
}
