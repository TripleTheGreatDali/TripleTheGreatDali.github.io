# GitHub Actions Quick Reference

## File Structure
```
.github/workflows/
├── build.yml          → Build & validate on every PR/push
├── deploy.yml         → Deploy to GitHub Pages
└── quality.yml        → Daily quality checks
```

## Triggers

### Build Workflow
```yaml
on:
  - push (to main/master)
  - pull_request (to main/master)
```

### Deploy Workflow
```yaml
on:
  - push (to main/master)
  - workflow_dispatch (manual)
```

### Quality Workflow
```yaml
on:
  - push (to main/master)
  - pull_request (to main/master)
  - schedule (daily 2 AM UTC)
```

---

## What Each Workflow Does

### 🔨 Build
```
✅ Checkout code
✅ Setup Node.js 18.x & 20.x
✅ Install dependencies
✅ Validate JSON files
✅ Verify HTML structure
✅ Upload artifacts
⏱️ Time: ~3-5 minutes
```

### 🚀 Deploy
```
✅ Build site
✅ Create package
✅ Deploy to Pages
✅ Validate deployment
⏱️ Time: ~5-10 minutes total
```

### ✔️ Quality
```
✅ Validate all JSON
✅ Check critical files
✅ Monitor file sizes
✅ Verify script order
⏱️ Time: ~2-3 minutes
```

---

## Common Tasks

### Check Status
1. Go to GitHub repository
2. Click "Actions" tab
3. View latest runs

### Manual Deploy
1. Actions → "Deploy to GitHub Pages"
2. "Run workflow" button
3. Wait for completion

### View Logs
1. Click workflow run
2. Click job name
3. Expand step to see logs

### Fix a Failed Workflow
1. Identify error in logs
2. Fix locally
3. Commit and push
4. Workflow reruns automatically

### Disable a Workflow
- Edit `.yml` file
- Add at top: `if: false`
- Commit

### Debug Locally
```bash
# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('file.json'))"

# List files
find assets/data -name "*.json"

# Check Node.js version
node --version
```

---

## Workflow Status Indicators

### ✅ Success
- Green checkmark
- All steps passed
- Site deployed

### ⚠️ Warning
- Yellow dot
- Check ran but with notice
- Might need review

### ❌ Failed
- Red X
- Check step logs
- Fix and push again

### ⏳ Running
- Yellow circle
- Currently executing
- Check after 5-10 minutes

---

## Key Node.js 24 Info

| Item | Status |
|------|--------|
| actions/checkout@v4 | ✅ Compatible |
| actions/setup-node@v4 | ✅ Compatible |
| actions/deploy-pages@v4 | ✅ Compatible |
| Your workflows | ✅ Ready |
| June 2 deadline | ✅ Handled |

---

## Performance Times

| Task | Time |
|------|------|
| Build (each Node version) | 1-2 min |
| Deploy | 2-3 min |
| Quality | 1-2 min |
| **Total** | **~5-10 min** |

---

## Artifact Info

| Workflow | Artifact | Retention |
|----------|----------|-----------|
| Build | build-artifacts-* | 7 days |
| Deploy | github-pages | 1 day |
| Quality | (none) | N/A |

---

## Environment Info

```yaml
Node Versions Tested:
  - 18.x ✅
  - 20.x ✅

Runner OS:
  - Ubuntu latest ✅

Concurrent Deploys:
  - 1 (protected) ✅
```

---

## Permissions

```yaml
contents: read        # Read code
pages: write          # Deploy to Pages
id-token: write       # Authentication
```

**No external secrets required** ✅

---

## Troubleshooting Matrix

| Problem | Check |
|---------|-------|
| Workflow won't start | Correct branch? (main/master) |
| Build fails | JSON valid? HTML exists? |
| Deploy fails | Pages enabled in settings? |
| Script errors | init-safeguard.js first? |
| Slow deploy | GitHub status? (status.github.com) |

---

## Links

| Resource | Link |
|----------|------|
| Full Guide | GITHUB_ACTIONS_GUIDE.md |
| Checklist | GITHUB_ACTIONS_CHECKLIST.md |
| GitHub Actions Docs | https://docs.github.com/actions |
| GitHub Status | https://status.github.com |

---

## Remember

- ✅ All workflows are Node.js 24 compatible
- ✅ No action needed after June 2, 2026
- ✅ Everything is automated (just push!)
- ✅ Comprehensive validation on every change
- ✅ Safe deployment with protection

**You're good to go!** 🚀
