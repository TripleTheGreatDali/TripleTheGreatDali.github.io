# Md Foysal Ahmed - Portfolio

> AI Research Engineer & Computer Vision Expert | Portfolio optimized for GitHub Pages

## 🚀 Website

Live at: [https://TripleTheGreatDali.github.io](https://TripleTheGreatDali.github.io)

## ✨ Features

- **Responsive Design** - Fully mobile-optimized for all devices
- **Performance Optimized** - GitHub Pages compatible with sub-2s load times
- **AI-Powered Portfolio** - Showcase of research, publications, and projects
- **Service Worker Support** - Offline capability with automatic caching
- **SEO Optimized** - Proper meta tags, robots.txt, and sitemap
- **Dark Theme** - Beautiful modern UI with smooth animations

## 📁 Project Structure

```
├── index.html            # Main entry point
├── css/                  # Stylesheets (optimized & minimal)
│   ├── critical.css     # Critical rendering path CSS
│   ├── main.css         # Core styles
│   ├── responsive.css   # Mobile optimization
│   └── [other styles]
├── js/                  # JavaScript modules
│   ├── main.js          # App controller
│   ├── api-service.js   # GitHub API integration
│   └── [utility scripts]
├── pages/               # Sub-pages (Education, Projects, etc.)
├── assets/              # Images and data
│   └── data/            # JSON data files
├── components/          # HTML components
├── _config.yml          # GitHub Pages configuration
├── robots.txt           # SEO configuration
├── sw.js                # Service worker for offline support
└── CNAME                # Custom domain configuration
```

## 🛠️ Tech Stack

- **Frontend Framework**: Vanilla JavaScript (no dependencies)
- **Styling**: CSS3 with modern features (Grid, Flexbox, animations)
- **Data**: Static JSON files (JSON API pattern)
- **Service Worker**: Network-first and cache-first strategies
- **Hosting**: GitHub Pages (static-only, no backend server)

## 🚀 Deployment

### Automatic (GitHub Actions)
The site deploys automatically when you push to the `master` branch.

### Manual
1. Ensure all files are committed
2. Go to repository Settings → Pages
3. Source: Deploy from a branch
4. Branch: master, folder: / (root)
5. Save

## ⚙️ Configuration

### Site Configuration
Edit `config.json` for site-wide settings:
```json
{
  "siteConfig": {
    "title": "Your Title",
    "baseUrl": "https://TripleTheGreatDali.github.io",
    "author": "Your Name"
  }
}
```

### Data Files
Update content in `assets/data/`:
- `publications.json` - Research papers and publications
- `projects.json` - Portfolio projects
- `skills.json` - Technical skills
- `news.json` - News and announcements
- `blog.json` - Blog posts

## 📊 Performance Optimization

### Current Optimizations
- ✅ Critical CSS inlining
- ✅ Lazy loading for images
- ✅ Service worker caching
- ✅ Minified CSS/JS
- ✅ DNS prefetch for Google Fonts
- ✅ Removed unused backend code
- ✅ Optimized API calls with caching

### Best Practices Applied
- Mobile-first responsive design
- Font optimization with `font-display: swap`
- Resource hints (dns-prefetch, preconnect)
- Efficient event delegation
- Debounced scroll handlers
- Progressive enhancement

## 📱 Browser Support

- Chrome/Edge latest
- Firefox latest
- Safari latest
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security

- Content Security Policy (CSP) enabled
- Permissions Policy enforced
- HTTPS only (recommended)
- No localStorage sensitive data

## 📈 SEO

- Meta tags for social sharing
- Open Graph tags
- Schema.org structured data
- Sitemap generation (via Jekyll)
- robots.txt configured
- Mobile-friendly responsive design
- Fast load times (Core Web Vitals optimized)

## 🐛 Debugging

### View Debug Information
- Open browser console (F12)
- Check Network tab for resource loading
- Verify API endpoint responses in Network tab

### Common Issues

**Content not loading?**
- Check browser console for errors
- Verify JSON files exist in `assets/data/`
- Ensure GitHub Pages is enabled in Settings

**Styling issues?**
- Clear browser cache (Ctrl+Shift+Delete)
- Verify CSS files load in Network tab
- Check for CSS variable definitions in `:root`

**API not working?**
- Verify endpoint paths match file names
- Check CORS headers in Network responses
- Ensure JSON syntax is valid

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## 📧 Contact

- Email: foysal.dali.fd@hotmail.com
- GitHub: [@TripleTheGreatDali](https://github.com/TripleTheGreatDali)
- ORCID: [0000-0002-5933-8968](https://orcid.org/0000-0002-5933-8968)

---

**Last Updated**: March 2026  
**Status**: ✅ Production Ready & Optimized for GitHub Pages