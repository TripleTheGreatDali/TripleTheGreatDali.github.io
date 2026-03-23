# GitHub Actions Setup Verification Checklist

## Files Created
- [ ] `.github/workflows/build.yml` exists
- [ ] `.github/workflows/deploy.yml` exists
- [ ] `.github/workflows/quality.yml` exists
- [ ] `GITHUB_ACTIONS_GUIDE.md` exists

## Repository Configuration

### GitHub Pages Settings
1. Go to: Repository → Settings → Pages
2. Verify:
   - [ ] Source: "Deploy from a branch"
   - [ ] Branch: "main" (or "master")
   - [ ] Folder: "/" (root)
   - [ ] HTTPS enforced (recommended)

### Workflow Permissions
1. Go to: Repository → Settings → Actions → General
2. Verify:
   - [ ] "Workflow permissions" = "Read and write permissions"
   - [ ] "Allow GitHub Actions to create and approve pull requests" = your choice

## First Run

### Initial Setup
1. [ ] Commit all `.github/workflows/` files
2. [ ] Push to main/master branch
3. [ ] Wait 1-2 minutes
4. [ ] Go to Actions tab → should see workflows running

### Monitor First Deployment
1. [ ] Actions tab shows 3 workflows
2. [ ] All workflows completed successfully
3. [ ] No Node.js 20 deprecation warnings
4. [ ] Site is live at https://[username].github.io

## Verification Steps

### Test Build Workflow
1. [ ] Open Actions tab
2. [ ] Find "Build" workflow
3. [ ] Click the latest run
4. [ ] Verify:
   - [ ] ✅ Build succeeded
   - [ ] ✅ Node.js 18.x tests passed
   - [ ] ✅ Node.js 20.x tests passed
   - [ ] ✅ JSON validation passed
   - [ ] ✅ HTML files verified
5. [ ] Artifacts uploaded and visible

### Test Deploy Workflow
1. [ ] Open Actions tab
2. [ ] Find "Deploy to GitHub Pages" workflow
3. [ ] Click the latest run
4. [ ] Verify:
   - [ ] ✅ Build stage succeeded
   - [ ] ✅ Upload artifact succeeded
   - [ ] ✅ Deploy to Pages succeeded
   - [ ] ✅ Validation stage passed

### Test Quality Workflow
1. [ ] Open Actions tab
2. [ ] Find "Quality Checks" workflow
3. [ ] Click the latest run
4. [ ] Verify:
   - [ ] ✅ JSON validation passed
   - [ ] ✅ HTML integrity passed
   - [ ] ✅ Critical files present
   - [ ] ✅ Script loading order correct

## Documentation

### Check Documentation
- [ ] Reviewed `GITHUB_ACTIONS_GUIDE.md`
- [ ] Understand each workflow's purpose
- [ ] Know how to troubleshoot issues
- [ ] Know where to find logs

## Version Checks

### Action Versions Used
Verify these versions are Node.js 24 compatible:
- [ ] actions/checkout@v4 ✅
- [ ] actions/setup-node@v4 ✅
- [ ] actions/configure-pages@v5 ✅
- [ ] actions/upload-artifact@v4 ✅
- [ ] actions/download-artifact@v4 ✅
- [ ] actions/deploy-pages@v4 ✅

## Deprecation Check

### Verify No Warnings
1. [ ] Open each workflow run in Actions
2. [ ] Check annotations section at top
3. [ ] Should see:
   ```
   ✅ No warnings
   ```
   NOT this:
   ```
   ⚠️ Node.js 20 actions are deprecated
   ```

## Automation Tests

### Manual Trigger Tests
1. [ ] Go to Actions → "Build" → "Run workflow"
   - [ ] Manually trigger build
   - [ ] Verify success
   
2. [ ] Go to Actions → "Deploy to GitHub Pages" → "Run workflow"
   - [ ] Manually trigger deploy
   - [ ] Verify deployment succeeds

3. [ ] Go to Actions → "Quality Checks" → "Run workflow"
   - [ ] Manually trigger quality checks
   - [ ] Verify all checks pass

### Scheduled Test
1. [ ] Quality workflow runs daily at 2 AM UTC
2. [ ] Check tomorrow's run
3. [ ] Verify it passed automatically

## Site Verification

### GitHub Pages Live Check
1. [ ] Visit your site: https://[username].github.io
2. Verify:
   - [ ] Page loads without errors
   - [ ] Navigation works
   - [ ] Data displays (blog, projects, etc.)
   - [ ] No console errors (F12 → Console tab)

### Content Verification
- [ ] Home page loads
- [ ] Blog page loads
- [ ] Projects page loads
- [ ] Publications page loads
- [ ] All navigation links work

### Performance Check
1. [ ] Open DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Refresh page
4. Verify:
   - [ ] No failed requests (red icons)
   - [ ] JSON files load from `/assets/data/`
   - [ ] Load time < 3 seconds

## Post-Deploy Checklist

### Everything Good?
- [ ] All 3 workflows appear in Actions tab
- [ ] Latest run for each shows ✅ success
- [ ] No deprecation warnings in any run
- [ ] Site is live and functional
- [ ] All data displays correctly
- [ ] No console errors

### Ready to Go!
If all boxes above are checked, you're all set! 🎉

---

## Troubleshooting Checklist

### If Workflow Fails
1. [ ] Click failed run
2. [ ] Expand failed job
3. [ ] Read error message
4. [ ] Check:
   - [ ] JSON files valid? (run locally: `node -c file.json`)
   - [ ] HTML files exist?
   - [ ] Required scripts present?
   - [ ] File paths correct?

### If Deployment Doesn't Appear
1. [ ] Wait 2-3 minutes
2. [ ] Hard refresh browser (Ctrl+Shift+R)
3. [ ] Check deployment URL is correct
4. [ ] Check GitHub Pages is enabled in settings
5. [ ] Check source branch is correct (main/master)

### If You See Node.js Warnings
1. [ ] Make sure you have the `.yml` files from this repo
2. [ ] Verify action versions:
   - `checkout@v4` (not v3)
   - `deploy-pages@v4` (not v3)
3. [ ] Delete old workflows if they exist
4. [ ] Wait for next run to confirm fix

---

## Contact / Questions

If you have issues, check:
1. **GITHUB_ACTIONS_GUIDE.md** - Detailed documentation
2. **GitHub Actions Documentation** - https://docs.github.com/actions
3. **Action-specific documentation** - Click on each action name in the workflow

---

**Last checked:** March 23, 2026
**Status:** ✅ All systems go!
