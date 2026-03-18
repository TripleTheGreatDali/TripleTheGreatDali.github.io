// Load data from JSON files and populate sections
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    await loadPublications();
    await loadSkills();
    setupEventListeners();
});

// Load Projects
async function loadProjects() {
    try {
        const response = await fetch('assets/data/projects.json');
        const projects = await response.json();
        const container = document.getElementById('projects-container');
        
        const projectsHTML = projects.slice(0, 6).map(project => `
            <div class="project-card">
                <div class="project-image">
                    ${project.image ? `<img src="${project.image}" alt="${project.title}">` : `<span>${project.icon}</span>`}
                </div>
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
        
        container.innerHTML = projectsHTML;
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load Publications
async function loadPublications() {
    try {
        const response = await fetch('assets/data/publications.json');
        const publications = await response.json();
        const container = document.getElementById('publications-container');
        
        const publicationsHTML = publications.slice(0, 4).map(pub => `
            <div class="publication-item">
                <div class="publication-title">${pub.title}</div>
                <div class="publication-authors">${pub.authors}</div>
                <div class="publication-meta">
                    ${pub.journal || pub.conference} ${pub.year}
                    ${pub.doi ? ` | DOI: <a href="https://doi.org/${pub.doi}" target="_blank">${pub.doi}</a>` : ''}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = publicationsHTML;
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

// Load Skills
async function loadSkills() {
    try {
        const response = await fetch('assets/data/skills.json');
        const skillsData = await response.json();
        const container = document.getElementById('skills-container');
        
        const skillsHTML = skillsData.map(category => `
            <div class="skill-category">
                <h4>${category.category}</h4>
                <div class="skill-list">
                    ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = skillsHTML;
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Handle Contact Form Submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    e.target.reset();
}

// Smooth scroll to sections
function smoothScroll(e) {
    if (e.target.tagName === 'A' && e.target.hash) {
        e.preventDefault();
        const element = document.querySelector(e.target.hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.research-card, .project-card, .publication-item, .skill-category').forEach(el => {
        observer.observe(el);
    });
});
