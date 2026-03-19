# 🧮 Calculus Challenge & 🔍 Search Features

## Overview

Your portfolio now includes two exciting interactive features:

1. **🧮 Calculus Challenge** - Solve a critical calculus problem to unlock your profile picture
2. **🔍 Global Search** - Search across all your content instantly

---

## 🔍 Search Feature

### How It Works

The search bar appears below your hero section and allows visitors to search through:

- **Blog Posts** - Search by title or content
- **News Items** - Search by title or description  
- **Projects** - Search by name or description
- **Publications** - Search by title or abstract
- **Skills** - Search by skill name
- **Research Areas** - Search by title or description

### Features

✅ **Real-time Search** - Results appear as you type  
✅ **8 Results Max** - Shows the most relevant results  
✅ **Result Preview** - Each result shows type, title, and snippet  
✅ **Direct Links** - Click any result to navigate to that page  
✅ **Smart Matching** - Case-insensitive, ignores extra spaces  

### Usage

```
1. Type at least 2 characters in the search bar
2. Results appear instantly below
3. Click any result to navigate
4. Clear the search to close results
```

### Search Indexing

The search functionality scans all JSON data files:
- `/assets/data/blog.json`
- `/assets/data/news.json`
- `/assets/data/projects.json`
- `/assets/data/publications.json`
- `/assets/data/skills.json`
- `/assets/data/upcoming.json`

---

## 🧮 Calculus Challenge

### How It Works

A **floating button in the bottom-right corner** (🧮 icon) opens an interactive calculus challenge. 

### Challenge System

**Problem Types:**
1. Finding derivatives (e.g., f(x) = 3x² + 2x + 1)
2. Evaluating integrals (e.g., ∫(4x³) dx)
3. Computing limits (e.g., lim sin(x)/x as x→0)
4. Special functions (e.g., derivative of e^x)
5. Definite integrals

**Difficulty:** CRITICAL 🔴

### Correct Answers Format

The system is flexible with answer formatting:

| Problem Type | Example Correct Answers |
|---|---|
| Derivatives | `6x+2`, `6x + 2`, `E^X`, `e^x` |
| Integrals | `x^4+c`, `X^4 + C`, `1/3` |
| Limits | `1`, `e`, `0` |

**Note:** The system automatically:
- Converts to lowercase
- Removes spaces
- Matches mathematically correct formats

### Unlock Profile Picture

**When you solve correctly:**

1. ✅ Success message appears
2. Your profile picture from `/assets/images/profile/profile.png` is revealed
3. Unlock status is saved in browser localStorage
4. Future visits show the profile immediately

### Hints System

Each problem includes a hint when you answer incorrectly:

```
Hint: Use the power rule
Hint: This is a fundamental calculus limit
Hint: The derivative of e^x is e^x
```

### Persistence

Your unlock status is stored in **browser localStorage** with key: `profileUnlocked`

This means:
- ✅ Once unlocked in a browser, it stays unlocked
- ✅ Other browsers/devices won't have the unlock
- ✅ Clearing browser data resets the challenge
- ✅ Users can manually unlock multiple times

### Bonus: Try More Challenges

If you unlock the profile, you can click "Try Another Challenge" to solve different calculus problems!

---

## 📁 File Structure

```
Files Created/Modified:

css/
├── search-challenge.css        [NEW] - Styling for search & challenge
│
js/
├── search-challenge.js         [NEW] - Logic for search & challenge
│
index.html                       [MODIFIED] - Added search bar & scripts
```

---

## 🎨 Styling

### Search Bar
- **Location:** Below hero section on every page view
- **Style:** Gradient blue border, glowing effect on focus
- **Animation:** Smooth transitions and fade-in effects

### Challenge Button
- **Location:** Fixed bottom-right corner (stays visible while scrolling)
- **Icon:** 🧮 (calculus/math symbol)
- **Interaction:** Floating effect, glows on hover, clickable

### Challenge Modal
- **Overlay:** Semi-transparent dark background
- **Content Box:** White card with rounded corners
- **Animation:** Slides in from top, fade in effect
- **Close:** X button to close at any time

### Profile Reveal
- **Image:** Displays your profile.png
- **Animation:** Slides up with fade-in
- **Celebration:** Shows congratulations message

---

## 🚀 Advanced Configuration

### Add More Challenges

Edit `js/search-challenge.js` and add to the `challenges` array:

```javascript
{
    problem: "Find the derivative of f(x) = ln(x)",
    answer: "1/x",
    hint: "Use the logarithm rule"
}
```

### Customize Search Placeholder

In `index.html`, modify the search bar:

```html
<input 
    placeholder="🔍 Your custom search text..."
>
```

### Change Challenge Button Icon

In `js/search-challenge.js`, find:

```javascript
button.innerHTML = '🧮'; // Change this emoji
```

### Adjust Search Result Limit

In `js/search-challenge.js`, find:

```javascript
return results.slice(0, 8); // Change 8 to any number
```

---

## 📊 Search Analytics

To track what users search for, add analytics to the `performSearch` function:

```javascript
// Add at the top of performSearch()
console.log('Search query:', query, 'Results found:', results.length);
// Send to analytics service
```

---

## 🔒 Privacy & Security

- **No data collection:** Search is local to the user's browser
- **No tracking:** Search queries are not sent to servers
- **No profiling:** localStorage is isolated per browser
- **No external calls:** All data is served locally

---

## 🐛 Troubleshooting

### Search Not Working
- Check browser console (F12) for errors
- Verify JSON files exist in `/assets/data/`
- Ensure JavaScript files are loaded

### Challenge Button Not Appearing
- Check if `search-challenge.js` is loading
- Verify CSS file is linked
- Clear browser cache

### Profile Picture Not Showing
- Check file exists: `/assets/images/profile/profile.png`
- Verify file permissions are readable
- Check browser console for image loading errors

### Answer Not Matching
- Remove extra spaces
- Use lowercase letters
- Check exact spelling
- Try alternative formats (e.g., `e^x` vs `E^X`)

---

## 📱 Responsive Design

Both features are fully responsive:

**Desktop:**
- Search bar: 600px max-width, centered
- Challenge button: Bottom-right corner
- Profile image: Up to 300px

**Mobile:**
- Search bar: 95% width, full-screen on focus
- Challenge button: Smaller (50px), positioned safely
- Profile image: Responsive (200px max)

---

## 🎯 Next Steps

1. **Test the Challenge** - Click the 🧮 button and try solving
2. **Try the Search** - Search for "blog" or any keyword
3. **Share with Visitors** - Let others know about the challenge
4. **Add More Questions** - Expand the challenge library
5. **Monitor Usage** - Check browser console for any issues

---

## 💡 Tips for Success

✨ **Make it Fun:** The calculus challenge is an easter egg - tell visitors about it!  
✨ **SEO Benefits:** Good search functionality improves user engagement  
✨ **Mobile First:** Both features work perfectly on mobile devices  
✨ **Browser Support:** Works on all modern browsers (Chrome, Firefox, Safari, Edge)  

---

Happy testing! 🚀
