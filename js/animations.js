// Advanced Animations & Interactions

// Scroll animations and interactive effects
document.addEventListener('DOMContentLoaded', () => {
    setupParticleAnimation();
    setupCardHoverEffects();
    setupScrollToTopButton();
    setupGlitchAnimation();
});

// Particle Animation
function setupParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        const randomDuration = 15 + Math.random() * 10;
        particle.style.setProperty('--duration', `${randomDuration}s`);
    });
}

// Card Hover Effects
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.publication-card, .project-card, .blog-card, .upcoming-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Scroll to Top Button
function setupScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, rgba(0, 217, 255, 0.8), rgba(176, 38, 255, 0.8));
        color: white;
        border: 2px solid rgba(0, 217, 255, 0.5);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 999;
        pointer-events: none;
        box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.8)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
    });
}

// Glitch Animation Effect
function setupGlitchAnimation() {
    const glitchElement = document.querySelector('.glitch');
    
    if (glitchElement) {
        // Add random glitch trigger every 3-5 seconds
        setInterval(() => {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = 'glitch-animation 2s ease-in-out';
            }, 10);
        }, 3000 + Math.random() * 2000);
    }
}

// Add smooth parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        const speed = 0.5 + (index * 0.1);
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch-animation {
        0%, 100% {
            text-shadow: 0 0 0 transparent;
        }
        20% {
            text-shadow: -2px 2px 0 rgba(176, 38, 255, 0.8), 2px -2px 0 rgba(0, 240, 255, 0.8);
        }
        40% {
            text-shadow: 3px -3px 0 rgba(0, 217, 255, 0.8), -3px 3px 0 rgba(176, 38, 255, 0.8);
        }
        60% {
            text-shadow: -2px 2px 0 rgba(0, 240, 255, 0.8), 2px -2px 0 rgba(176, 38, 255, 0.8);
        }
        80% {
            text-shadow: 2px 2px 0 rgba(176, 38, 255, 0.8), -2px -2px 0 rgba(0, 217, 255, 0.8);
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

    @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(50px, -50px); }
        50% { transform: translate(-30px, 30px); }
        75% { transform: translate(20px, 50px); }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(10px); }
    }

    .scroll-to-top:hover {
        animation: bounce 0.6s ease-in-out;
    }

    /* Smooth card transition */
    .publication-card, .project-card, .blog-card, .upcoming-card {
        position: relative;
        overflow: hidden;
    }

    .publication-card::after, .project-card::after, .blog-card::after, .upcoming-card::after {
        content: '';
        position: absolute;
        top: var(--mouse-y, 50%);
        left: var(--mouse-x, 50%);
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 217, 255, 0.1), transparent);
        transform: translate(-50%, -50%);
        pointer-events: none;
        transition: width 0.3s, height 0.3s;
    }

    .publication-card:hover::after, .project-card:hover::after, .blog-card:hover::after, .upcoming-card:hover::after {
        width: 300px;
        height: 300px;
    }
`;
document.head.appendChild(style);

// Add smooth scroll behavior enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    }
});

// Monitor scroll position for navbar transparency
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.pageYOffset > 50) {
            navbar.style.borderBottomColor = 'rgba(0, 217, 255, 0.2)';
        } else {
            navbar.style.borderBottomColor = 'rgba(0, 217, 255, 0.1)';
        }
    }
});
