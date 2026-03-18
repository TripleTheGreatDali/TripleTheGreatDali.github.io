// ==================== SITE CONFIGURATION & UTILITIES ====================

const siteConfig = {
    name: 'MD Foysal Ahmed',
    email: 'foysal.dali.fd@hotmail.com',
    github: 'https://github.com/TripleTheGreatDali'
};

// ==================== LOAD DATA FROM JSON ====================
async function loadJSON(filePath) {
    try {
        const response = await fetch(filePath);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        return null;
    }
}

// ==================== RENDER PUBLICATIONS ====================
async function renderPublications() {
    const publications = await loadJSON('data/publications.json');
    const container = document.getElementById('publications-container');
    
    if (!container || !publications) return;
    
    let html = '<div class="publications-grid">';
    publications.forEach(pub => {
        html += `
            <div class="pub-card">
                <span class="pub-year">${pub.year}</span>
                <h3 class="pub-title">${pub.title}</h3>
                <p class="pub-journal">${pub.journal}</p>
                <p class="pub-type">${pub.type}</p>
                <a href="${pub.url}" class="pub-doi" target="_blank">
                    DOI: ${pub.doi} →
                </a>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ==================== RENDER PROJECTS ====================
async function renderProjects() {
    const projects = await loadJSON('data/projects.json');
    const container = document.getElementById('projects-container');
    
    if (!container || !projects) return;
    
    let html = '<div class="projects-grid">';
    projects.forEach(project => {
        html += `
            <div class="card">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-meta">${project.type} • ${project.year}</p>
                <p class="card-content">${project.description}</p>
                <div style="margin-top: 1rem;">
                    ${project.technologies.map(tech => 
                        `<span class="skill-item">${tech}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ==================== RENDER SKILLS ====================
async function renderSkills() {
    const skills = await loadJSON('data/skills.json');
    const container = document.getElementById('skills-container');
    
    if (!container || !skills) return;
    
    let html = '<div class="skills-grid">';
    for (const [category, items] of Object.entries(skills)) {
        html += `
            <div class="skill-category">
                <h3>${category}</h3>
                <div>
                    ${items.map(skill => 
                        `<span class="skill-item">${skill}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

// ==================== RENDER EDUCATION ====================
async function renderEducation() {
    const education = await loadJSON('data/education.json');
    const container = document.getElementById('education-container');
    
    if (!container || !education) return;
    
    let html = '<div class="timeline">';
    education.forEach(edu => {
        html += `
            <div class="timeline-item">
                <div class="timeline-date">${edu.period}</div>
                <h3>${edu.degree}</h3>
                <p>${edu.institution}</p>
                <p class="card-meta">GPA: ${edu.gpa}</p>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ==================== NAVIGATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Render dynamic content
    renderPublications();
    renderProjects();
    renderSkills();
    renderEducation();
    
    // Mobile menu toggle (optional)
    const menuButton = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== CONTACT FORM ====================
function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Log form data (replace with actual backend)
    console.log('Form submitted:', Object.fromEntries(formData));
    alert('Thank you! I will get back to you soon.');
    form.reset();
}
