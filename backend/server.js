const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// ==================== BLOG ENDPOINTS ====================

/**
 * GET /api/blog
 * Get all blog posts
 */
app.get('/api/blog', (req, res) => {
  try {
    const blogPath = path.join(__dirname, '../assets/data/blog.json');
    const blogData = fs.readFileSync(blogPath, 'utf-8');
    res.json(JSON.parse(blogData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load blog posts', details: error.message });
  }
});

/**
 * GET /api/blog/:id
 * Get a specific blog post by ID
 */
app.get('/api/blog/:id', (req, res) => {
  try {
    const blogPath = path.join(__dirname, '../assets/data/blog.json');
    const blogData = fs.readFileSync(blogPath, 'utf-8');
    const posts = JSON.parse(blogData);
    const post = posts[req.params.id];
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load blog post', details: error.message });
  }
});

/**
 * POST /api/blog
 * Create a new blog post (requires authentication in production)
 */
app.post('/api/blog', (req, res) => {
  try {
    const { date, title, excerpt } = req.body;

    if (!date || !title || !excerpt) {
      return res.status(400).json({ error: 'Missing required fields: date, title, excerpt' });
    }

    const blogPath = path.join(__dirname, '../assets/data/blog.json');
    const blogData = fs.readFileSync(blogPath, 'utf-8');
    const posts = JSON.parse(blogData);

    const newPost = { date, title, excerpt, link: '#blog' };
    posts.unshift(newPost);

    fs.writeFileSync(blogPath, JSON.stringify(posts, null, 2));
    res.status(201).json({ message: 'Blog post created', post: newPost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post', details: error.message });
  }
});

// ==================== NEWS ENDPOINTS ====================

/**
 * GET /api/news
 * Get all news items
 */
app.get('/api/news', (req, res) => {
  try {
    const newsPath = path.join(__dirname, '../assets/data/news.json');
    const newsData = fs.readFileSync(newsPath, 'utf-8');
    res.json(JSON.parse(newsData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load news', details: error.message });
  }
});

/**
 * POST /api/news
 * Create a new news item
 */
app.post('/api/news', (req, res) => {
  try {
    const { date, title, content } = req.body;

    if (!date || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields: date, title, content' });
    }

    const newsPath = path.join(__dirname, '../assets/data/news.json');
    const newsData = fs.readFileSync(newsPath, 'utf-8');
    const news = JSON.parse(newsData);

    const newItem = { date, title, content };
    news.unshift(newItem);

    fs.writeFileSync(newsPath, JSON.stringify(news, null, 2));
    res.status(201).json({ message: 'News item created', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create news item', details: error.message });
  }
});

// ==================== PROJECTS ENDPOINTS ====================

/**
 * GET /api/projects
 * Get all projects
 */
app.get('/api/projects', (req, res) => {
  try {
    const projectsPath = path.join(__dirname, '../assets/data/projects.json');
    const projectsData = fs.readFileSync(projectsPath, 'utf-8');
    res.json(JSON.parse(projectsData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects', details: error.message });
  }
});

/**
 * POST /api/projects
 * Create a new project
 */
app.post('/api/projects', (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Missing required fields: title, description' });
    }

    const projectsPath = path.join(__dirname, '../assets/data/projects.json');
    const projectsData = fs.readFileSync(projectsPath, 'utf-8');
    const projects = JSON.parse(projectsData);

    const newProject = { title, description, tags: tags || [] };
    projects.push(newProject);

    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    res.status(201).json({ message: 'Project created', project: newProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// ==================== PUBLICATIONS ENDPOINTS ====================

/**
 * GET /api/publications
 * Get all publications
 */
app.get('/api/publications', (req, res) => {
  try {
    const pubPath = path.join(__dirname, '../assets/data/publications.json');
    const pubData = fs.readFileSync(pubPath, 'utf-8');
    res.json(JSON.parse(pubData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load publications', details: error.message });
  }
});

// ==================== SKILLS ENDPOINTS ====================

/**
 * GET /api/skills
 * Get all skills
 */
app.get('/api/skills', (req, res) => {
  try {
    const skillsPath = path.join(__dirname, '../assets/data/skills.json');
    const skillsData = fs.readFileSync(skillsPath, 'utf-8');
    res.json(JSON.parse(skillsData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load skills', details: error.message });
  }
});

// ==================== RESEARCH ENDPOINTS ====================

/**
 * GET /api/research
 * Get all research areas
 */
app.get('/api/research', (req, res) => {
  try {
    const researchPath = path.join(__dirname, '../assets/data/upcoming.json');
    const researchData = fs.readFileSync(researchPath, 'utf-8');
    res.json(JSON.parse(researchData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load research', details: error.message });
  }
});

// ==================== HEALTH CHECK ====================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING ====================

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`🚀 Foylix Portfolio Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
