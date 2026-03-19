# Foylix Portfolio - Content Management Guide

## Overview

This is a complete portfolio & blog management system for MD Foysal Ahmed. All content is managed through JSON files and a Node.js backend API.

## Content Structure

### 1. Blog Posts
**Location:** `/assets/data/blog.json`

Blog posts are displayed on `/pages/blog.html` and individual blog post pages are shown on `/pages/blog-post.html`.

**Adding a Blog Post:**
```json
{
  "date": "March 20, 2026",
  "title": "Your Blog Post Title",
  "excerpt": "Brief excerpt of your blog post content...",
  "link": "#blog"
}
```

**Via API:**
```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "date": "March 20, 2026",
    "title": "My Blog Post",
    "excerpt": "My blog post excerpt..."
  }'
```

### 2. News Items
**Location:** `/assets/data/news.json`

News items appear on the `/pages/news.html` page.

**Adding a News Item:**
```json
{
  "date": "March 20, 2026",
  "title": "News Title",
  "content": "Full news content here"
}
```

**Via API:**
```bash
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "date": "March 20, 2026",
    "title": "News Title",
    "content": "News content"
  }'
```

### 3. Projects
**Location:** `/assets/data/projects.json`

Projects are displayed on `/pages/projects.html`.

**Adding a Project:**
```json
{
  "title": "Project Name",
  "description": "Project description",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "link": "https://github.com/project-link",
  "image": "path/to/image.jpg"
}
```

**Via API:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "Project description",
    "tags": ["AI", "Deep Learning"]
  }'
```

### 4. Publications
**Location:** `/assets/data/publications.json`

Academic publications are displayed on `/pages/publications.html`.

**Format:**
```json
{
  "title": "Publication Title",
  "authors": ["Author 1", "Author 2"],
  "conference": "Conference Name",
  "year": 2026,
  "link": "https://doi.org/...",
  "abstract": "Publication abstract"
}
```

### 5. Skills
**Location:** `/assets/data/skills.json`

Skills are organized by category and displayed on `/pages/skills.html`.

**Format:**
```json
[
  {
    "category": "Programming Languages",
    "skills": ["Python", "Java", "C++", "JavaScript"]
  },
  {
    "category": "ML/AI Frameworks",
    "skills": ["PyTorch", "TensorFlow", "Scikit-learn"]
  }
]
```

### 6. Research Areas
**Location:** `/assets/data/upcoming.json`

Research topics and upcoming projects displayed on `/pages/research.html`.

**Format:**
```json
[
  {
    "title": "Research Title",
    "description": "Research description",
    "tags": ["AI", "Computer Vision"]
  }
]
```

## Pages Overview

| Page | Location | Purpose | Data Source |
|------|----------|---------|------------|
| Home | `/index.html` | Main landing page | Multiple JSON files |
| Blog | `/pages/blog.html` | Blog post listing | `/assets/data/blog.json` |
| Blog Post | `/pages/blog-post.html` | Individual blog post | `/assets/data/blog.json` (indexed) |
| News | `/pages/news.html` | News listing | `/assets/data/news.json` |
| Projects | `/pages/projects.html` | Projects listing | `/assets/data/projects.json` |
| Publications | `/pages/publications.html` | Publications listing | `/assets/data/publications.json` |
| Education | `/pages/education.html` | Education timeline | Hardcoded (can be moved to JSON) |
| Research | `/pages/research.html` | Research areas | `/assets/data/upcoming.json` |
| Skills | `/pages/skills.html` | Skills listing | `/assets/data/skills.json` |
| Contact | `/pages/contact.html` | Contact form | Static page |

## Backend Setup Instructions

### Install Backend Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install
```

### Start the Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Quick Start Workflow

### 1. Adding New Blog Post

**Option A: Edit JSON directly**
1. Open `/assets/data/blog.json`
2. Add new blog post object to the beginning of the array
3. Save the file

**Option B: Use Backend API**
```bash
# Start backend server first (npm start in /backend)
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "date": "March 20, 2026",
    "title": "New Blog Post",
    "excerpt": "This is my new blog post about AI..."
  }'
```

### 2. Adding News Item
Follow same workflow as blog posts but use `/Pages/news.html` endpoint or `/assets/data/news.json` file.

### 3. Adding Project
Edit `/assets/data/projects.json` or use API `POST /api/projects`

## Directory Structure for Content

```
assets/
├── data/
│   ├── blog.json           # Blog posts content
│   ├── news.json           # News content
│   ├── projects.json       # Projects content
│   ├── publications.json   # Publications content
│   ├── skills.json         # Skills content
│   └── upcoming.json       # Research areas content
└── images/
    ├── profile/            # Profile pictures
    └── others/             # Project images, etc.

pages/
├── blog.html              # Blog listing page
├── blog-post.html         # Individual blog post page
├── education.html         # Education page
├── news.html              # News page
├── projects.html          # Projects page
├── publications.html      # Publications page
├── research.html          # Research page
├── skills.html            # Skills page
└── contact.html           # Contact page
```

## API Endpoints Summary

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get blog post by ID
- `POST /api/blog` - Create new blog post

### News
- `GET /api/news` - Get all news items
- `POST /api/news` - Create new news item

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project

### Publications
- `GET /api/publications` - Get all publications

### Skills
- `GET /api/skills` - Get all skills

### Research
- `GET /api/research` - Get all research areas

### Health
- `GET /api/health` - Check API status

## Deployment

### Static Site (GitHub Pages)
The frontend is already set up for GitHub Pages. Just push to your repository.

### Backend API
For production deployment:
1. Deploy to Heroku, Railway, Vercel, or any Node.js hosting
2. Set environment variables in `.env`
3. Update frontend API calls to point to production URL

## Tips & Best Practices

1. **Keep JSON formatted** - Use proper JSON syntax to avoid errors
2. **Use consistent dates** - Format: "Month Date, Year" (e.g., "March 20, 2026")
3. **Add to beginning** - New blog posts and news items should be added to the start of arrays (most recent first)
4. **Update categories** - Keep skills organized by meaningful categories
5. **Link management** - Update project and publication links regularly
6. **Image optimization** - Use optimized images in `/assets/images/` folder
7. **Backup regularly** - Keep backups of your JSON data files

## Troubleshooting

### Blog posts not showing
1. Check `/assets/data/blog.json` is valid JSON
2. Verify browser console for errors
3. Clear browser cache

### Backend API not accessible
1. Ensure backend is running (`npm start` in /backend)
2. Check port 5000 is not in use
3. Verify CORS is enabled

### Pages not loading
1. Check relative paths are correct
2. Verify CSS files exist
3. Clear browser cache

## Support

For issues or questions about the system, refer to:
- `/backend/README.md` for backend documentation
- Individual page HTML files for frontend documentation
- JSON data files for content structure examples
