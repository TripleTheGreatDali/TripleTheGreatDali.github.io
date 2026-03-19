// Load all data and initialize the portfolio
document.addEventListener('DOMContentLoaded', async () => {
    setupMobileMenu();
    setupNavigation();
    await loadPublications();
    await loadUpcomingResearch();
    await loadNews();
    await loadProjects();
    await loadBlog();
    setupContactForm();
    setupScrollAnimations();
});

// Mobile Menu Toggle
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Setup Navigation Active States
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

// Load Publications
async function loadPublications() {
    try {
        const response = await fetch('assets/data/publications.json');
        const publications = await response.json();
        const container = document.getElementById('publications-container');
        
        function renderPublications(year = 'all') {
            let filtered = publications;
            
            if (year !== 'all') {
                filtered = publications.filter(pub => pub.year === parseInt(year));
            }
            
            const html = filtered.map(pub => `
                <div class="publication-card">
                    <div class="publication-year">${pub.year}</div>
                    <div class="publication-title">${pub.title}</div>
                    <div class="publication-venue">${pub.journal || pub.conference}</div>
                    <div class="publication-abstract">${pub.abstract}</div>
                    <div class="publication-tags">
                        ${pub.tags.map(tag => `<span class="publication-tag">${tag}</span>`).join('')}
                    </div>
                    ${pub.doi ? `<div class="publication-links" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);"><a href="${pub.doi}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background: var(--accent-neon); color: var(--bg-dark); border-radius: 5px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">🔗 View Article</a></div>` : ''}
                </div>
            `).join('');
            
            container.innerHTML = html;
        }
        
        renderPublications();
        
        // Filter buttons
        document.querySelectorAll('.publications-filter .filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.publications-filter .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderPublications(this.dataset.filter);
            });
        });
        
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

// Load Upcoming Research
async function loadUpcomingResearch() {
    try {
        const response = await fetch('assets/data/upcoming.json');
        const upcoming = await response.json();
        const container = document.getElementById('upcoming-container');
        
        const html = upcoming.map(item => `
            <div class="upcoming-card">
                <div class="status-badge">${item.status}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="publication-tags">
                    ${item.keywords.map(kw => `<span class="publication-tag">${kw}</span>`).join('')}
                </div>
                ${item.targetConference ? `<p style="margin-top: 12px; color: var(--accent-neon);"><strong>Target:</strong> ${item.targetConference}</p>` : ''}
                ${item.expectedDate ? `<p style="color: var(--text-secondary);">Expected: ${item.expectedDate}</p>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading upcoming research:', error);
    }
}

// Load News & Updates
async function loadNews() {
    try {
        const response = await fetch('assets/data/news.json');
        const news = await response.json();
        const container = document.getElementById('news-container');
        
        const html = news.map((item, index) => `
            <div class="news-item" style="animation-delay: ${index * 0.1}s">
                <div class="news-content">
                    <div class="news-date">${item.date} • ${item.icon} ${item.category}</div>
                    <div class="news-title">${item.title}</div>
                    <div class="news-description">${item.description}</div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Load Projects
async function loadProjects() {
    try {
        const response = await fetch('assets/data/projects.json');
        const projects = await response.json();
        const container = document.getElementById('projects-container');
        
        const html = projects.slice(0, 6).map(project => `
            <div class="project-card">
                <div class="project-image">${project.icon}</div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank">Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load Blog Posts
async function loadBlog() {
    try {
        const response = await fetch('assets/data/blog.json');
        const blog = await response.json();
        const container = document.getElementById('blog-container');
        
        const html = blog.slice(0, 6).map(post => `
            <div class="blog-card">
                <div class="blog-date">${post.date}</div>
                <div class="blog-title">${post.title}</div>
                <div class="blog-excerpt">${post.excerpt}</div>
                <a href="${post.link || '#'}" class="blog-readmore">Read More →</a>
            </div>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading blog:', error);
    }
}

// Setup Contact Form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }
}

// Handle Contact Form Submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    console.log('Form submitted:', data);
    alert('Thank you for your message! I will get back to you soon.');
    e.target.reset();
}

// Setup Scroll Animations
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
    document.querySelectorAll('.publication-card, .project-card, .blog-card, .upcoming-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}
