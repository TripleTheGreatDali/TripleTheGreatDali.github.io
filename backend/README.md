# Foylix Portfolio Backend

Backend API server for the Foylix Portfolio - MD Foysal Ahmed's AI Research & Computer Vision showcase.

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration (if needed)

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Blog Endpoints
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get a specific blog post
- `POST /api/blog` - Create a new blog post
  - Body: `{ date, title, excerpt }`

### News Endpoints
- `GET /api/news` - Get all news items
- `POST /api/news` - Create a new news item
  - Body: `{ date, title, content }`

### Projects Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
  - Body: `{ title, description, tags }`

### Publications Endpoints
- `GET /api/publications` - Get all publications

### Skills Endpoints
- `GET /api/skills` - Get all skills

### Research Endpoints
- `GET /api/research` - Get all research areas

### Health Check
- `GET /api/health` - Check API status

## Examples

### Get all blog posts
```bash
curl http://localhost:5000/api/blog
```

### Create a new blog post
```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "date": "March 20, 2026",
    "title": "My New Blog Post",
    "excerpt": "This is an excerpt of my new blog post about AI and deep learning."
  }'
```

### Get all news
```bash
curl http://localhost:5000/api/news
```

## Project Structure

```
backend/
├── package.json          # Dependencies and scripts
├── server.js             # Main server file
├── .env.example          # Example environment variables
├── .env                  # Environment variables (not in git)
└── README.md             # This file
```

## Content Storage

All content is stored in JSON files in `/assets/data/`:

- `blog.json` - Blog posts
- `news.json` - News items
- `projects.json` - Projects
- `publications.json` - Publications
- `skills.json` - Skills
- `upcoming.json` - Research areas

You can edit these files directly or use the API endpoints to add new content.

## Future Enhancements

- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] Authentication & Authorization
- [ ] Admin Dashboard
- [ ] Email notifications
- [ ] Search functionality
- [ ] Content filtering and sorting
- [ ] File upload for project images

## License

MIT License - See LICENSE file for details
