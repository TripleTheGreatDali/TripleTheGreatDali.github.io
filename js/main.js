// ============================================
// MAIN APPLICATION JAVASCRIPT
// ============================================

// Global Configuration
const CONFIG = {
    scrollOffset: 80,
    animationDuration: 800,
    debounceDelay: 250,
    apiEndpoint: 'https://api.github.com/users/TripleTheGreatDali'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Smooth scroll to element
 */
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - CONFIG.scrollOffset;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/**
 * Debounce function for performance
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

/**
 * Animate counter
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('navMenu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // Hamburger menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.setActive(link);
                smoothScroll(target);
                this.closeMenu();
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', throttle(() => this.updateNavbar(), 16));
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }

    setActive(link) {
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    updateNavbar() {
        if (window.scrollY > 50) {
            this.navbar.style.background = 'rgba(15, 52, 96, 1)';
            this.navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(15, 52, 96, 0.95)';
        }

        // Update active link based on scroll position
        this.updateActiveByScroll();
    }

    updateActiveByScroll() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset - 50;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// FORM FUNCTIONALITY
// ============================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.inputs = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message')
        };
        this.errors = {
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            subject: document.getElementById('subjectError'),
            message: document.getElementById('messageError')
        };
        this.statusElement = document.getElementById('formStatus');

        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        Object.keys(this.inputs).forEach(key => {
            this.inputs[key].addEventListener('blur', () => this.validateField(key));
            this.inputs[key].addEventListener('input', () => this.clearError(key));
        });
    }

    /**
     * Validate single field
     */
    validateField(field) {
        let isValid = true;
        const value = this.inputs[field].value.trim();

        switch (field) {
            case 'name':
                isValid = value.length >= 2;
                if (!isValid) {
                    this.setError(field, 'Name must be at least 2 characters');
                }
                break;
            case 'email':
                isValid = this.validateEmail(value);
                if (!isValid) {
                    this.setError(field, 'Please enter a valid email address');
                }
                break;
            case 'subject':
                isValid = value.length >= 3;
                if (!isValid) {
                    this.setError(field, 'Subject must be at least 3 characters');
                }
                break;
            case 'message':
                isValid = value.length >= 10;
                if (!isValid) {
                    this.setError(field, 'Message must be at least 10 characters');
                }
                break;
        }

        return isValid;
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Set error message
     */
    setError(field, message) {
        this.errors[field].textContent = message;
        this.inputs[field].style.borderColor = '#E53E3E';
    }

    /**
     * Clear error message
     */
    clearError(field) {
        this.errors[field].textContent = '';
        this.inputs[field].style.borderColor = '';
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isValid = Object.keys(this.inputs).every(field => this.validateField(field));

        if (!isValid) {
            this.showStatus('Please fix the errors above', 'error');
            return;
        }

        // Prepare form data
        const formData = {
            name: this.inputs.name.value.trim(),
            email: this.inputs.email.value.trim(),
            subject: this.inputs.subject.value.trim(),
            message: this.inputs.message.value.trim()
        };

        try {
            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send email via Formspree or similar service
            const response = await fetch('https://formspree.io/f/xovqwapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            this.showStatus('Failed to send message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    }

    /**
     * Show status message
     */
    showStatus(message, type = 'success') {
        this.statusElement.textContent = message;
        this.statusElement.className = `form-status ${type}`;

        setTimeout(() => {
            this.statusElement.textContent = '';
            this.statusElement.className = 'form-status';
        }, 5000);
    }
}

// ============================================
// DYNAMIC CONTENT LOADING
// ============================================

class ContentLoader {
    constructor() {
        this.pubCount = document.getElementById('pubCount');
        this.projCount = document.getElementById('projCount');
        this.pubList = document.getElementById('publicationsList');
        this.projectList = document.getElementById('projectsList');
    }

    init() {
        this.loadPublications();
        this.loadProjects();
    }

    /**
     * Load publications from JSON
     */
    async loadPublications() {
        try {
            const response = await fetch('data/publications.json');
            const publications = await response.json();

            this.pubCount.textContent = publications.length;

            this.pubList.innerHTML = publications.map((pub, index) => `
                <div class="publication-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="publication-header">
                        <span class="publication-year">${pub.year}</span>
                        <h3 class="publication-title">${pub.title}</h3>
                    </div>
                    <div class="publication-body">
                        <p class="publication-journal">
                            <strong>${pub.journal}</strong>
                        </p>
                        <p class="publication-doi">
                            DOI: <a href="${pub.doi}" target="_blank" class="publication-link">${pub.doi}</a>
                        </p>
                    </div>
                </div>
            `).join('');

            // Trigger AOS refresh
            if (window.AOS) {
                AOS.refresh();
            }
        } catch (error) {
            console.error('Error loading publications:', error);
        }
    }

    /**
     * Load projects from JSON
     */
    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            const projects = await response.json();

            this.projCount.textContent = projects.length;

            this.projectList.innerHTML = projects.map((project, index) => `
                <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="project-image">
                        ${project.emoji}
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');

            // Trigger AOS refresh
            if (window.AOS) {
                AOS.refresh();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
}

// ============================================
// PARTICLE CANVAS ANIMATION
// ============================================

class ParticleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.init();
    }

    init() {
        this.setCanvasSize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.setCanvasSize());
    }

    setCanvasSize() {
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Draw particle
            this.ctx.fillStyle = `rgba(255, 165, 0, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw connections
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.strokeStyle = `rgba(15, 52, 96, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        window.addEventListener('scroll', throttle(() => this.checkElements(), 16));
        setTimeout(() => this.checkElements(), 100);
    }

    checkElements() {
        this.animatedElements.forEach(element => {
            if (!element.classList.contains('is-visible') && isInViewport(element)) {
                element.classList.add('is-visible');
            }
        });
    }
}

// ============================================
// STATISTICS COUNTER
// ============================================

class StatsCounter {
    constructor() {
        this.counters = {
            pubCount: { element: document.getElementById('pubCount'), target: 7 },
            projCount: { element: document.getElementById('projCount'), target: 10 },
            citCount: { element: document.getElementById('citCount'), target: 12 }
        };

        this.hasAnimated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', throttle(() => this.checkAndAnimate(), 500));
    }

    checkAndAnimate() {
        if (this.hasAnimated) return;

        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        if (isInViewport(heroSection)) {
            this.animate();
            this.hasAnimated = true;
        }
    }

    animate() {
        Object.values(this.counters).forEach(counter => {
            if (counter.element) {
                animateCounter(counter.element, counter.target);
            }
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing MD Foysal Ahmed Portfolio Website...');

    // Initialize components
    const navigation = new Navigation();
    const contactForm = new ContactForm();
    const contentLoader = new ContentLoader();
    const particleCanvas = new ParticleCanvas('particleCanvas');
    const scrollAnimations = new ScrollAnimations();
    const statsCounter = new StatsCounter();

    // Load content
    contentLoader.init();

    console.log('✅ All components initialized successfully!');

    // Expose utility functions globally for easy access
    window.smoothScroll = smoothScroll;
});

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
