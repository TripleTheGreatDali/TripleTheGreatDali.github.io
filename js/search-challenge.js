/* ==================== SEARCH & CHALLENGE FUNCTIONALITY ==================== */

// Initialize search and challenge on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeChallengeButton();
});

// ==================== SEARCH FUNCTIONALITY ====================

function initializeSearch() {
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) return;

    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');

    if (!searchBar) return;

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const results = performSearch(query);
        displaySearchResults(results, searchResults);
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.innerHTML = '';
        }
    });
}

async function performSearch(query) {
    const results = [];
    
    try {
        // Search blog posts
        const blogRes = await fetch('assets/data/blog.json');
        const blogs = await blogRes.json();
        blogs.forEach((post, idx) => {
            if (post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)) {
                results.push({
                    type: 'Blog',
                    title: post.title,
                    snippet: post.excerpt.substring(0, 100) + '...',
                    link: 'pages/blog-post.html?id=' + idx
                });
            }
        });

        // Search news
        const newsRes = await fetch('assets/data/news.json');
        const news = await newsRes.json();
        news.forEach((item, idx) => {
            if (item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'News',
                    title: item.title,
                    snippet: item.description.substring(0, 100) + '...',
                    link: 'pages/news-detail.html?id=' + idx
                });
            }
        });

        // Search projects
        const projectRes = await fetch('assets/data/projects.json');
        const projects = await projectRes.json();
        projects.forEach(project => {
            if (project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'Project',
                    title: project.title,
                    snippet: project.description.substring(0, 100) + '...',
                    link: 'pages/projects.html'
                });
            }
        });

        // Search publications
        const pubRes = await fetch('assets/data/publications.json');
        const pubs = await pubRes.json();
        pubs.forEach(pub => {
            if (pub.title.toLowerCase().includes(query) || pub.abstract.toLowerCase().includes(query)) {
                results.push({
                    type: 'Publication',
                    title: pub.title,
                    snippet: pub.abstract.substring(0, 100) + '...',
                    link: 'pages/publications.html'
                });
            }
        });

        // Search skills
        const skillRes = await fetch('assets/data/skills.json');
        const skills = await skillRes.json();
        skills.forEach(category => {
            category.skills.forEach(skill => {
                if (skill.toLowerCase().includes(query)) {
                    results.push({
                        type: 'Skill',
                        title: skill,
                        snippet: 'Category: ' + category.category,
                        link: 'pages/skills.html'
                    });
                }
            });
        });

        // Search research
        const researchRes = await fetch('assets/data/upcoming.json');
        const research = await researchRes.json();
        research.forEach(item => {
            if (item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'Research',
                    title: item.title,
                    snippet: item.description.substring(0, 100) + '...',
                    link: 'pages/research.html'
                });
            }
        });

    } catch (error) {
        console.error('Error during search:', error);
    }

    return results.slice(0, 8); // Limit to 8 results
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">No results found</div>';
        return;
    }

    const html = results.map(result => `
        <div class="search-result-item" onclick="window.location.href='${result.link}'">
            <div class="result-type">${result.type}</div>
            <div class="result-title">${highlightQuery(result.title)}</div>
            <div class="result-snippet">${result.snippet}</div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function highlightQuery(text) {
    const query = document.getElementById('search-bar')?.value || '';
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: #FFEB3B; color: #000;">$1</mark>');
}

// ==================== CALCULUS CHALLENGE ====================

// Challenge problems
const challenges = [
    {
        problem: "Find the derivative of f(x) = 3x² + 2x + 1",
        answer: "6x+2",
        hint: "Use the power rule"
    },
    {
        problem: "Evaluate the integral ∫(4x³) dx",
        answer: "x^4+c",
        hint: "Use the power rule for integration"
    },
    {
        problem: "What is the limit as x→0 of sin(x)/x?",
        answer: "1",
        hint: "This is a fundamental calculus limit"
    },
    {
        problem: "Find f'(x) for f(x) = e^x",
        answer: "e^x",
        hint: "The derivative of e^x is e^x"
    },
    {
        problem: "Evaluate ∫₀¹ x² dx",
        answer: "1/3",
        hint: "Use the power rule and fundamental theorem"
    }
];

let currentChallenge = null;
let challengeUnlocked = localStorage.getItem('profileUnlocked') === 'true';
let challengeTimer = null;
let timeUntilNextChallenge = 60;

function initializeChallengeButton() {
    // Create challenge button
    const button = document.createElement('button');
    button.className = 'challenge-button';
    button.innerHTML = '🧮';
    button.title = 'Solve Calculus Challenge to Unlock Profile';
    button.addEventListener('click', () => openChallengeModal());
    document.body.appendChild(button);

    // Create challenge modal
    const modal = document.createElement('div');
    modal.className = 'challenge-modal';
    modal.id = 'challenge-modal';
    modal.innerHTML = `
        <div class="challenge-content">
            <button class="challenge-close" onclick="closeChallengeModal()">×</button>
            <div class="challenge-header">
                <h2>Calculus Challenge 🧮</h2>
                <p>Solve this problem to unlock my profile picture</p>
                <span class="challenge-difficulty">CRITICAL</span>
            </div>
            <div class="challenge-timer" id="challenge-timer" style="text-align: center; margin-bottom: 15px; font-size: 0.9em; color: var(--text-secondary);">
                ⏱️ Next question in: <span id="timer-countdown">60</span>s
            </div>
            <div class="challenge-problem" id="challenge-problem"></div>
            <form class="challenge-form" id="challenge-form" onsubmit="checkChallenge(event)">
                <input 
                    type="text" 
                    class="challenge-input" 
                    id="challenge-answer" 
                    placeholder="Enter your answer (e.g., 6x+2 or 1)" 
                    autocomplete="off"
                    required
                >
                <div style="font-size: 0.85em; color: #666;">
                    💡 Tip: Remove spaces, use lowercase (e.g., e^x, not E^X)
                </div>
                <button type="submit" class="challenge-submit">Check Answer</button>
            </form>
            <div class="challenge-feedback" id="challenge-feedback"></div>
            <div class="profile-unlock" id="profile-unlock">
                <div class="profile-unlock-text">🎉 Correct! Behold the AI Researcher!</div>
                <img src="assets/images/profile/profile.png" alt="Profile Picture">
                <p style="color: #666; margin-top: 15px;">Welcome to my world of AI and research! 🚀</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Load initial challenge
    loadNewChallenge();

    // If already unlocked, show profile
    if (challengeUnlocked) {
        document.getElementById('profile-unlock').classList.add('revealed');
    }
}

function loadNewChallenge() {
    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    document.getElementById('challenge-problem').textContent = currentChallenge.problem;
    document.getElementById('challenge-answer').value = '';
    document.getElementById('challenge-feedback').innerHTML = '';
    document.getElementById('challenge-answer').focus();
    
    // Reset timer for next question
    timeUntilNextChallenge = 60;
    updateTimer();
    
    // Clear any previous timer
    if (challengeTimer) {
        clearInterval(challengeTimer);
    }
    
    // Start countdown to next challenge
    startChallengeTimer();
}

function startChallengeTimer() {
    // Every second, decrease countdown
    challengeTimer = setInterval(() => {
        timeUntilNextChallenge--;
        updateTimer();
        
        // When time reaches 0, automatically load new challenge
        if (timeUntilNextChallenge <= 0) {
            clearInterval(challengeTimer);
            
            // Only auto-load if modal is still open
            if (document.getElementById('challenge-modal').classList.contains('active')) {
                // Show transition
                const problemDiv = document.getElementById('challenge-problem');
                problemDiv.style.opacity = '0.5';
                
                // Load new challenge after brief delay for visual effect
                setTimeout(() => {
                    loadNewChallenge();
                    problemDiv.style.opacity = '1';
                }, 500);
            }
        }
    }, 1000);
}

function updateTimer() {
    const timerDisplay = document.getElementById('timer-countdown');
    if (timerDisplay) {
        timerDisplay.textContent = timeUntilNextChallenge;
        
        // Change color as time runs out
        if (timeUntilNextChallenge <= 10) {
            timerDisplay.style.color = '#ff006e';
            timerDisplay.style.fontWeight = 'bold';
        } else if (timeUntilNextChallenge <= 30) {
            timerDisplay.style.color = '#ffc107';
        } else {
            timerDisplay.style.color = 'var(--text-secondary)';
        }
    }
}

function openChallengeModal() {
    document.getElementById('challenge-modal').classList.add('active');
    if (challengeUnlocked) {
        document.getElementById('challenge-form').style.display = 'none';
        document.getElementById('profile-unlock').classList.add('revealed');
        // Still show timer div but it won't cycle since challenge is unlocked
        const timerDiv = document.getElementById('challenge-timer');
        if (timerDiv) timerDiv.style.display = 'none';
    } else {
        loadNewChallenge();
        // Ensure timer div is visible
        const timerDiv = document.getElementById('challenge-timer');
        if (timerDiv) timerDiv.style.display = 'flex';
    }
}

function closeChallengeModal() {
    document.getElementById('challenge-modal').classList.remove('active');
    // Clear the timer when modal closes to prevent timer running in background
    if (challengeTimer) {
        clearInterval(challengeTimer);
        challengeTimer = null;
    }
}

function checkChallenge(e) {
    e.preventDefault();
    
    const userAnswer = document.getElementById('challenge-answer').value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '');
    
    const correctAnswer = currentChallenge.answer
        .toLowerCase()
        .replace(/\s+/g, '');
    
    const feedback = document.getElementById('challenge-feedback');
    const profileUnlock = document.getElementById('profile-unlock');

    if (userAnswer === correctAnswer) {
        feedback.classList.remove('error');
        feedback.classList.add('success');
        feedback.textContent = '✅ Correct! You solved it!';
        
        // Clear the auto-cycle timer since challenge is solved
        if (challengeTimer) {
            clearInterval(challengeTimer);
            challengeTimer = null;
        }
        
        // Unlock profile
        challengeUnlocked = true;
        localStorage.setItem('profileUnlocked', 'true');
        
        // Show profile picture
        setTimeout(() => {
            document.getElementById('challenge-form').style.display = 'none';
            document.getElementById('challenge-timer').style.display = 'none';
            profileUnlock.classList.add('revealed');
        }, 500);

    } else {
        feedback.classList.remove('success');
        feedback.classList.add('error');
        feedback.textContent = `❌ Incorrect! Hint: ${currentChallenge.hint}`;
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('challenge-modal');
    if (e.target === modal) {
        closeChallengeModal();
    }
});

// Bonus: Show new challenge after solving (multiple attempts)
function nextChallenge() {
    if (challengeUnlocked) {
        loadNewChallenge();
        document.getElementById('challenge-form').style.display = 'flex';
        document.getElementById('profile-unlock').classList.remove('revealed');
    }
}
