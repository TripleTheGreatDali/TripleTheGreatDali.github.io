# Foylix Portfolio - Quick Start Guide

Welcome! Your portfolio and blog system is now fully operational with clickable page navigation, content management, and a backend API.

## What's New ✨

### **1. All Links Are Now Clickable Pages**
Instead of anchor links to sections on a single page, all navigation items now drive to dedicated pages:

- ✅ Home → `index.html`
- ✅ Education → `pages/education.html`
- ✅ Publications → `pages/publications.html`
- ✅ Research → `pages/research.html` (new)
- ✅ Projects → `pages/projects.html`
- ✅ News → `pages/news.html` (new)
- ✅ Blog → `pages/blog.html` (new - Foylix Blog!)
- ✅ Contact → `pages/contact.html`

### **2. Foylix Blog System** 📚
A dedicated blog page (`pages/blog.html`) where:
- All blog posts are dynamically loaded from `assets/data/blog.json`
- Each blog post is clickable and opens in a dedicated page (`pages/blog-post.html`)
- Blog posts display title, date, excerpt, and topics

### **3. Content Management System** 📝
All content is stored in JSON files for easy management:
- `/assets/data/blog.json` - Blog posts
- `/assets/data/news.json` - News items
- `/assets/data/projects.json` - Projects
- `/assets/data/publications.json` - Publications
- `/assets/data/skills.json` - Skills
- `/assets/data/upcoming.json` - Research areas

### **4. Backend API Server** 🚀
A Node.js/Express backend for managing content:
- Located in `/backend/` directory
- RESTful API for CRUD operations
- JSON-based data storage

## File Structure Overview

```
TripleTheGreatDali.github.io/
├── index.html                    # Main home page
├── CONTENT_MANAGEMENT.md         # Detailed content management guide
├── QUICK_START_GUIDE.md          # This file
│
├── pages/                        # All page files
│   ├── blog.html                # Blog listing page (NEW)
│   ├── blog-post.html           # Individual blog post page (NEW)
│   ├── education.html           # Education page (NEW)
│   ├── news.html                # News page (NEW)
│   ├── research.html            # Research page (NEW)
│   ├── skills.html              # Skills page (NEW)
│   ├── projects.html            # Projects page (existing - updated)
│   ├── publications.html        # Publications page (existing - updated)
│   └── contact.html             # Contact page (existing - updated)
│
├── assets/
│   ├── data/                    # Content storage (JSON files)
│   │   ├── blog.json            # Blog content
│   │   ├── news.json            # News content
│   │   ├── projects.json        # Projects content
│   │   ├── publications.json    # Publications content
│   │   ├── skills.json          # Skills content
│   │   └── upcoming.json        # Research content
│   └── images/                  # Image files
│
├── backend/                     # Backend API server (NEW)
│   ├── package.json             # Node.js dependencies
│   ├── server.js                # Main server file
│   ├── .env.example             # Environment variables example
│   └── README.md                # Backend documentation
│
├── css/
├── js/
└── components/
```

## Getting Started

### **Step 1: Run the Website Locally**
Simply open `index.html` in your browser to view the website with all new pages.

### **Step 2: Start the Backend Server (Optional)**
To use the API for content management:

```bash
cd backend
npm install
npm start
```

The API will run on `http://localhost:5000`

### **Step 3: Add Content**

**Adding a Blog Post:**
1. Edit `/assets/data/blog.json`
2. Add new entry to the beginning of the array:
```json
{
  "date": "March 20, 2026",
  "title": "Your Blog Post Title",
  "excerpt": "Brief excerpt of your post...",
  "link": "#blog"
}
```
3. Save file - changes appear automatically on blog page!

**Or use the API:**
```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -d '{"date":"March 20, 2026","title":"My Post","excerpt":"Excerpt..."}'
```

**Adding News:**
Similar process - edit `/assets/data/news.json` or use `POST /api/news` endpoint

**Adding Projects:**
Edit `/assets/data/projects.json` or use `POST /api/projects` endpoint

## Key Features

### ✨ Dynamic Content Loading
All pages automatically load content from JSON files in real-time using JavaScript fetch requests.

### 🎨 Consistent Styling
All new pages use the same design system as your existing pages:
- Animated background with particles
- Blue theme (#1F4E79)
- Responsive layout
- Smooth transitions

### 📱 Mobile Responsive
All pages are fully responsive and work on mobile devices.

### 🔄 Easy Updates
No need to rebuild or deploy - just edit JSON files and reload the page!

## Navigation Structure

```
Home (index.html)
│
├── Education (pages/education.html)
├── Publications (pages/publications.html)
├── Research (pages/research.html)
├── Projects (pages/projects.html)
├── News (pages/news.html)
├── Blog (pages/blog.html)
│   └── Blog Post (pages/blog-post.html?id=0)
└── Contact (pages/contact.html)
```

All pages have navigation menus pointing to each other!

## API Endpoints (When Backend is Running)

### Blog
```
GET  /api/blog           # Get all blog posts
GET  /api/blog/:id       # Get specific blog post
POST /api/blog           # Create new blog post
```

### News
```
GET  /api/news           # Get all news
POST /api/news           # Create news item
```

### Projects
```
GET  /api/projects       # Get all projects
POST /api/projects       # Create new project
```

### Other Resources
```
GET  /api/publications   # Get all publications
GET  /api/skills         # Get all skills
GET  /api/research       # Get all research areas
GET  /api/health         # Check API status
```

## Content Location Reference

| Content Type | Edit Location | Page | Load Method |
|---|---|---|---|
| Blog Posts | `/assets/data/blog.json` | `/pages/blog.html` | JSON + JavaScript |
| News | `/assets/data/news.json` | `/pages/news.html` | JSON + JavaScript |
| Projects | `/assets/data/projects.json` | `/pages/projects.html` | JSON + JavaScript |
| Publications | `/assets/data/publications.json` | `/pages/publications.html` | Existing page |
| Skills | `/assets/data/skills.json` | `/pages/skills.html` | JSON + JavaScript |
| Research | `/assets/data/upcoming.json` | `/pages/research.html` | JSON + JavaScript |

## Common Tasks

### Add a Blog Post
1. Edit `/assets/data/blog.json`
2. Add entry at the beginning: `{ "date": "...", "title": "...", "excerpt": "..." }`
3. Save and refresh browser

### Add News
Same as blog posts, but edit `/assets/data/news.json`

### Add a Project
Edit `/assets/data/projects.json` and add: `{ "title": "...", "description": "...", "tags": [...] }`

### Add Research Area
Edit `/assets/data/upcoming.json` and add: `{ "title": "...", "description": "...", "tags": [...] }`

### Add Skill
Edit `/assets/data/skills.json` - organized by category

## Deployment

### GitHub Pages (Frontend)
Your site is already set up for GitHub Pages. Just push changes to your repository:
```bash
git add .
git commit -m "Update content and pages"
git push
```

### Backend API Deployment
To deploy the backend permanently:
1. Choose a hosting provider (Heroku, Railway, Vercel, render.com)
2. Follow their Node.js deployment guide
3. Update frontend API calls to point to your backend URL

Example deployment providers:
- **Heroku** - Free tier available
- **Railway** - Simple deployment
- **Render** - Good documentation
- **DigitalOcean** - Affordable VPS

## Troubleshooting

### Blog posts not showing?
- Check `/assets/data/blog.json` has valid JSON format
- Clear browser cache (Ctrl+Shift+Delete)
- Open console (F12) and check for errors

### Backend not accessible?
- Ensure you ran `npm install` and `npm start` in `/backend`
- Check port 5000 is not blocked
- Verify CORS is enabled in `server.js`

### Pages not loading?
- Check file paths are correct (relative paths from page location)
- Verify CSS files exist in `/css/` folder
- Clear browser cache

## Next Steps

1. **Customize Content** - Update JSON files with your actual content
2. **Add More Blog Posts** - Use the blog system regularly
3. **Deploy Backend** - Set up backend API for production use
4. **Add Images** - Place project/profile images in `/assets/images/`
5. **SEO Optimization** - Update meta tags in HTML files

## Need Help?

Refer to these documents for detailed information:
- **CONTENT_MANAGEMENT.md** - Complete content management guide
- **backend/README.md** - Backend API documentation
- Check individual page HTML files for code comments

---

**Your Foylix Portfolio is ready to use! Start by adding your blog posts. Happy blogging! 🚀**
