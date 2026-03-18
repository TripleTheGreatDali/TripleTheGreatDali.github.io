"""
Professional Academic Portfolio Website Generator
Generates complete HTML, CSS, JS, and data files from CV content
"""

import os
import json
from pathlib import Path
from datetime import datetime

# ==================== CONFIGURATION ====================
SITE_CONFIG = {
    "name": "MD Foysal Ahmed",
    "title": "AI Researcher & Software Engineer",
    "location": "Mianyang, Sichuan, China",
    "github": "https://github.com/TripleTheGreatDali",
    "orcid": "https://orcid.org/0000-0002-5933-8968",
    "email": "foysal.dali.fd@hotmail.com",
    "phone": "+88-01835085533",
    "wos": "https://www.webofscience.com/wos/author/record/LGY-3964-2024",
}

# ==================== DATA DEFINITIONS ====================
EDUCATION_DATA = [
    {
        "institution": "Southwest University of Science and Technology, Mianyang, China",
        "degree": "Master of Engineering in Software Engineering",
        "period": "2023–2025",
        "gpa": "88.60%",
        "icon": "🎓"
    },
    {
        "institution": "Southwest University of Science and Technology, Mianyang, China",
        "degree": "Bachelor of Engineering in Computer Science and Technology",
        "period": "2019–2023",
        "gpa": "87.05%",
        "icon": "🎓"
    },
    {
        "institution": "Milestone College, Dhaka, Bangladesh",
        "degree": "Higher Secondary Certificate (HSC) (Science)",
        "period": "2015–2017",
        "gpa": "5.00/5.00 (A+)",
        "icon": "📚"
    },
    {
        "institution": "Kamarjuri Yousuf Ali High School, Gazipur, Bangladesh",
        "degree": "Secondary School Certificate (SSC) (Science)",
        "period": "2013–2015",
        "gpa": "5.00/5.00 (Golden A+)",
        "icon": "📚"
    }
]

PUBLICATIONS_DATA = [
    {
        "title": "Algorithmic co-arguers: AI-mediated argumentation and structural epistemic injustice",
        "journal": "AI and Ethics",
        "year": 2026,
        "doi": "10.1007/s43681-026-01078-3",
        "url": "https://doi.org/10.1007/s43681-026-01078-3",
        "type": "Journal"
    },
    {
        "title": "Hybrid intelligence systems as ontological mirrors of human cognition",
        "journal": "AI and Ethics",
        "year": 2026,
        "doi": "10.1007/s43681-026-01032-3",
        "url": "https://doi.org/10.1007/s43681-026-01032-3",
        "type": "Journal"
    },
    {
        "title": "Multi-task model with attribute-specific heads for person re-identification",
        "journal": "Pattern Analysis and Applications",
        "year": 2025,
        "doi": "10.1007/s10044-025-01421-0",
        "url": "https://doi.org/10.1007/s10044-025-01421-0",
        "type": "Journal"
    },
    {
        "title": "TriFusion hybrid model for human activity recognition",
        "journal": "Signal Image and Video Processing",
        "year": 2024,
        "doi": "10.1007/s11760-024-03487-5",
        "url": "https://doi.org/10.1007/s11760-024-03487-5",
        "type": "Journal"
    },
    {
        "title": "YOLOv7-Based Multiple Surgical Tool Localization and Detection in Laparoscopic Videos",
        "journal": "12th IFMBE APCMBE 2023",
        "year": 2023,
        "doi": "10.1007/978-3-031-51485-2_6",
        "url": "https://doi.org/10.1007/978-3-031-51485-2_6",
        "type": "Conference"
    },
    {
        "title": "A Real-Time Laparoscopic Surgical Instrument Detection System Based on YOLOv5",
        "journal": "CISP-BMEI 2023",
        "year": 2023,
        "doi": "10.1109/CISP-BMEI60920.2023.10373249",
        "url": "https://doi.org/10.1109/CISP-BMEI60920.2023.10373249",
        "type": "Conference"
    },
    {
        "title": "Novel Closed-Form Expressions for Ergodic Capacity of MIMO Ad-Hoc Networks",
        "journal": "EITCE 2021",
        "year": 2021,
        "doi": "10.1145/3501409.3501690",
        "url": "https://doi.org/10.1145/3501409.3501690",
        "type": "Conference"
    }
]

PROJECTS_DATA = [
    {
        "id": "human-activity-recognition",
        "title": "Human Activity Recognition System Based on Hybrid Model",
        "type": "Master Thesis",
        "description": "Advanced deep learning system for recognizing human activities from sensor and video data using hybrid neural architectures.",
        "technologies": ["PyTorch", "Python", "Deep Learning", "Computer Vision"],
        "image": "activity-recognition.jpg",
        "year": 2025
    },
    {
        "id": "surgical-tool-detection",
        "title": "YOLOv7-Based Multiple Surgical Tool Localization and Detection",
        "type": "Bachelor Thesis",
        "description": "Real-time detection of multiple surgical instruments in laparoscopic videos using advanced YOLO architecture with high accuracy.",
        "technologies": ["YOLOv7", "OpenCV", "PyTorch", "Medical Imaging"],
        "image": "surgical-detection.jpg",
        "year": 2023
    }
]

SKILLS_DATA = {
    "AI/Computer Vision": ["PyTorch", "TensorFlow", "OpenCV", "YOLO Architectures"],
    "Programming Languages": ["Python3", "Java", "C", "HTML", "CSS"],
    "Edge & IoT Tools": ["ROS", "Docker", "Linux", "Embedded Systems"],
    "Software Engineering": ["System Architecture", "Performance Optimization", "API Development", "Flask", "FastAPI"],
    "Data Processing": ["NumPy", "Pandas", "Scikit-learn", "Real-time Streaming"],
    "Languages": ["English (Fluent)", "Bengali (Native)", "Chinese (HSK3 - Intermediate)"]
}

RESEARCH_INTERESTS = [
    "Image Processing & Medical Imaging",
    "Object Detection & Deep Learning",
    "Computer Vision & Machine Learning",
    "Pattern Recognition & Data Mining",
    "AI in Robotics & Transfer Learning",
    "Speech Recognition & Signal Processing",
    "NLP & Brain-Computer Interfaces",
    "Deep Reinforcement Learning",
    "AI Ethics & Responsible AI"
]

AWARDS_DATA = [
    {"award": "1st Prize Special Scholarship", "institution": "SWUST", "year": 2019},
    {"award": "Honorary Certificate, Class Monitor", "institution": "SWUST", "year": 2023},
    {"award": "Sichuan Provincial Government Scholarship", "institution": "SWUST", "year": 2023},
    {"award": "1st Prize", "institution": "SWUST", "year": 2023},
    {"award": "3rd Prize Biomedical Engineering Design Competition", "institution": "Sichuan Province", "year": 2024},
    {"award": "Honorary Certificate, Class Monitor", "institution": "SWUST", "year": 2025},
]

# ==================== FILE GENERATORS ====================

class SiteGenerator:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.ensure_directories()
    
    def ensure_directories(self):
        """Create all necessary directories"""
        dirs = [
            'assets/images/projects',
            'assets/images/publications',
            'assets/images/icons',
            'assets/documents',
            'assets/fonts',
            'css',
            'js',
            'data',
            'pages',
            'components'
        ]
        for d in dirs:
            (self.base_path / d).mkdir(parents=True, exist_ok=True)
        print(f"✓ Directories ensured")
    
    def write_file(self, relative_path, content):
        """Write content to file"""
        file_path = self.base_path / relative_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Created: {relative_path}")
    
    def generate_json_data(self):
        """Generate all JSON data files"""
        # Publications
        self.write_file('data/publications.json', json.dumps(PUBLICATIONS_DATA, indent=2))
        
        # Projects
        self.write_file('data/projects.json', json.dumps(PROJECTS_DATA, indent=2))
        
        # Skills
        self.write_file('data/skills.json', json.dumps(SKILLS_DATA, indent=2))
        
        # Education
        self.write_file('data/education.json', json.dumps(EDUCATION_DATA, indent=2))
        
        # Awards
        self.write_file('data/awards.json', json.dumps(AWARDS_DATA, indent=2))
        
        # Research Interests
        self.write_file('data/research-interests.json', json.dumps(RESEARCH_INTERESTS, indent=2))
        
        # Config
        self.write_file('data/config.json', json.dumps(SITE_CONFIG, indent=2))
    
    def generate_css(self):
        """Generate main CSS stylesheet"""
        css_content = '''/* ==================== PROFESSIONAL ACADEMIC PORTFOLIO ====================
   Color Scheme: Deep Blue & Accent
   Font: Modern, Clean, Professional
   ====================================================================== */

:root {
    --primary-color: #1F4E79;
    --accent-color: #2E75B6;
    --light-bg: #F5F7FA;
    --white: #FFFFFF;
    --dark-text: #1A1A1A;
    --light-text: #666666;
    --border-color: #E0E0E0;
    --success-color: #27AE60;
    --warning-color: #F39C12;
    
    --transition: all 0.3s ease-in-out;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--dark-text);
    background-color: var(--white);
    overflow-x: hidden;
}

/* ==================== HEADER & NAVIGATION ====================*/
header {
    background: var(--primary-color);
    color: var(--white);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow);
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.nav-links a {
    color: var(--white);
    text-decoration: none;
    transition: var(--transition);
    font-weight: 500;
}

.nav-links a:hover {
    color: var(--accent-color);
}

/* ==================== HERO SECTION ====================*/
.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    color: var(--white);
    padding: 4rem 2rem;
    text-align: center;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    animation: fadeInDown 0.8s ease-out;
}

.hero .subtitle {
    font-size: 1.3rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeInUp 0.8s ease-out 0.4s both;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background-color: var(--accent-color);
    color: var(--white);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.btn-secondary {
    background-color: var(--white);
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
    background-color: var(--light-bg);
}

/* ==================== SECTIONS ====================*/
section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

section h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 2rem;
    border-bottom: 3px solid var(--accent-color);
    padding-bottom: 0.5rem;
    display: inline-block;
}

/* ==================== CARDS ====================*/
.card {
    background: var(--white);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: var(--transition);
    box-shadow: var(--shadow);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.card-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.card-meta {
    color: var(--light-text);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.card-content {
    color: var(--dark-text);
    line-height: 1.8;
}

/* ==================== PUBLICATION GRID ====================*/
.publications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.pub-card {
    background: var(--white);
    border-left: 4px solid var(--accent-color);
    padding: 1.5rem;
    border-radius: 4px;
    box-shadow: var(--shadow);
    transition: var(--transition);
}

.pub-card:hover {
    box-shadow: var(--shadow-lg);
}

.pub-year {
    display: inline-block;
    background: var(--accent-color);
    color: var(--white);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: bold;
}

.pub-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 1rem 0 0.5rem;
    color: var(--primary-color);
}

.pub-journal {
    font-style: italic;
    color: var(--light-text);
    margin-bottom: 0.75rem;
}

.pub-doi {
    display: inline-block;
    margin-top: 0.75rem;
}

.pub-doi a {
    color: var(--accent-color);
    text-decoration: none;
    font-weight: 500;
}

.pub-doi a:hover {
    text-decoration: underline;
}

/* ==================== SKILLS SECTION ====================*/
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.skill-category {
    background: var(--light-bg);
    padding: 1.5rem;
    border-radius: 8px;
    border-top: 4px solid var(--accent-color);
}

.skill-category h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.skill-item {
    background: var(--white);
    display: inline-block;
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    border-radius: 20px;
    border: 1px solid var(--accent-color);
    color: var(--accent-color);
    font-size: 0.9rem;
    font-weight: 500;
}

/* ==================== TIMELINE ====================*/
.timeline {
    position: relative;
    padding: 2rem 0;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--accent-color);
}

.timeline-item {
    margin-bottom: 2rem;
    margin-left: 2rem;
    padding-left: 2rem;
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--accent-color);
}

.timeline-date {
    color: var(--accent-color);
    font-weight: bold;
    font-size: 0.9rem;
}

/* ==================== FOOTER ====================*/
footer {
    background: var(--primary-color);
    color: var(--white);
    padding: 2rem;
    text-align: center;
    margin-top: 3rem;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.footer-links a {
    color: var(--white);
    text-decoration: none;
    transition: var(--transition);
}

.footer-links a:hover {
    color: var(--accent-color);
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 1rem;
    margin-top: 1rem;
}

/* ==================== ANIMATIONS ====================*/
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ==================== RESPONSIVE ====================*/
@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    section {
        padding: 2rem 1rem;
    }
    
    .publications-grid {
        grid-template-columns: 1fr;
    }
    
    .skills-grid {
        grid-template-columns: 1fr;
    }
}
'''
        self.write_file('css/style.css', css_content)
    
    def generate_main_js(self):
        """Generate main JavaScript file"""
        js_content = '''// ==================== SITE CONFIGURATION & UTILITIES ====================

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
'''
        self.write_file('js/main.js', js_content)
    
    def generate_index_html(self):
        """Generate main index.html"""
        html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MD Foysal Ahmed - AI Researcher & Software Engineer</title>
    <meta name="description" content="Academic portfolio of MD Foysal Ahmed - AI researcher, computer vision expert, and software engineer based in China.">
    <meta name="keywords" content="AI, Computer Vision, Research, Software Engineering, Deep Learning">
    <meta name="author" content="MD Foysal Ahmed">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="MD Foysal Ahmed - AI Researcher">
    <meta property="og:description" content="Portfolio and research publication showcase">
    <meta property="og:type" content="website">
    
    <link rel="stylesheet" href="css/style.css">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
</head>
<body>
    <!-- HEADER & NAVIGATION -->
    <header>
        <nav class="navbar">
            <div class="logo">MD Foysal Ahmed</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#publications">Publications</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- HERO SECTION -->
    <section class="hero" id="home">
        <h1>MD Foysal Ahmed</h1>
        <p class="subtitle">🤖 AI Researcher | 👨‍💻 Software Engineer | 🎓 Academic Excellence</p>
        <p style="font-size: 1rem; margin-bottom: 2rem;">Passionate about Hybrid Intelligence, Robotics, and Advanced AI Systems</p>
        <div class="cta-buttons">
            <a href="#publications" class="btn btn-primary">View Research</a>
            <a href="#projects" class="btn btn-secondary">Explore Projects</a>
            <a href="assets/documents/CV.pdf" class="btn btn-secondary" target="_blank">Download CV</a>
        </div>
    </section>

    <!-- ABOUT SECTION -->
    <section id="about">
        <h2>About Me</h2>
        <div class="card">
            <h3>Visionary & Perfectionist</h3>
            <p>I'm a computer scientist with deep expertise in AI, computer vision, and software engineering. Currently pursuing a Master's degree in Software Engineering at Southwest University of Science and Technology (SWUST), with strong research focus on hybrid intelligence systems, robotics, and AGI.</p>
            <p style="margin-top: 1rem;">My research bridges academia, AI innovation, and practical applications, with publications in top-tier journals and conferences. I'm driven by the vision of leveraging advanced AI technologies to solve real-world problems.</p>
        </div>
        
        <h3 style="margin-top: 2rem; color: #1F4E79;">Key Interests</h3>
        <div id="research-interests"></div>
    </section>

    <!-- PUBLICATIONS SECTION -->
    <section id="publications">
        <h2>Publications</h2>
        <p style="margin-bottom: 2rem; color: #666;">Peer-reviewed research in AI, computer vision, and software engineering</p>
        <div id="publications-container">Loading publications...</div>
    </section>

    <!-- PROJECTS SECTION -->
    <section id="projects">
        <h2>Projects</h2>
        <p style="margin-bottom: 2rem; color: #666;">Academic and research projects showcasing technical expertise</p>
        <div id="projects-container">Loading projects...</div>
    </section>

    <!-- SKILLS SECTION -->
    <section id="skills">
        <h2>Technical Skills</h2>
        <div id="skills-container">Loading skills...</div>
    </section>

    <!-- EDUCATION SECTION -->
    <section id="education">
        <h2>Education</h2>
        <div id="education-container">Loading education...</div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact">
        <h2>Get In Touch</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div class="card">
                <h3>📧 Email</h3>
                <p><a href="mailto:foysal.dali.fd@hotmail.com" style="color: #2E75B6;">foysal.dali.fd@hotmail.com</a></p>
            </div>
            <div class="card">
                <h3>📍 Location</h3>
                <p>Mianyang, Sichuan, China</p>
            </div>
            <div class="card">
                <h3>🔗 Links</h3>
                <p><a href="https://github.com/TripleTheGreatDali" target="_blank">GitHub</a> • 
                   <a href="https://orcid.org/0000-0002-5933-8968" target="_blank">ORCID</a> •
                   <a href="https://www.webofscience.com/wos/author/record/LGY-3964-2024" target="_blank">WoS</a></p>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="footer-content">
            <div class="footer-links">
                <a href="https://github.com/TripleTheGreatDali" target="_blank">GitHub</a>
                <a href="https://orcid.org/0000-0002-5933-8968" target="_blank">ORCID</a>
                <a href="mailto:foysal.dali.fd@hotmail.com">Email</a>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 MD Foysal Ahmed. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="js/main.js"></script>
    <script>
        // Render research interests
        async function renderResearchInterests() {
            const interests = await loadJSON('data/research-interests.json');
            const container = document.querySelector('#about .card:last-child') || document.getElementById('research-interests');
            if (!interests || !container) return;
            
            let html = '<ul style="columns: 2; list-style-position: inside;">';
            interests.forEach(interest => {
                html += `<li style="margin-bottom: 0.5rem;">✓ ${interest}</li>`;
            });
            html += '</ul>';
            
            const div = document.getElementById('research-interests');
            if (div) div.innerHTML = html;
        }
        
        document.addEventListener('DOMContentLoaded', renderResearchInterests);
    </script>
</body>
</html>
'''
        self.write_file('index.html', html_content)
    
    def generate_all(self):
        """Generate all site files"""
        print("\n🚀 Generating Professional Academic Portfolio Website...\n")
        
        self.generate_json_data()
        print("\n✓ Data files generated")
        
        self.generate_css()
        self.generate_main_js()
        self.generate_index_html()
        
        print("\n" + "="*50)
        print("✅ WEBSITE GENERATION COMPLETE!")
        print("="*50)
        print(f"\n📁 Location: {self.base_path}")
        print("\n📋 Generated Files:")
        print("   ✓ index.html (Main homepage)")
        print("   ✓ css/style.css (Complete styling)")
        print("   ✓ js/main.js (Interactive features)")
        print("   ✓ data/ (7 JSON data files)")
        print("\n🚀 Next Steps:")
        print("   1. Add your profile image to assets/images/")
        print("   2. Add project screenshots to assets/images/projects/")
        print("   3. Add your CV PDF to assets/documents/CV.pdf")
        print("   4. Customize colors in css/style.css if desired")
        print("   5. Push to GitHub to publish your site")
        print("\n💡 Your site will be live at: https://TripleTheGreatDali.github.io")
        print("=" * 50 + "\n")


# ==================== MAIN EXECUTION ====================
if __name__ == "__main__":
    # Get the script's directory
    current_dir = Path(__file__).parent
    
    generator = SiteGenerator(current_dir)
    generator.generate_all()
