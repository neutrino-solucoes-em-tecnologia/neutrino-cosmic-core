# Automated Code Review - Quick Start Guide

## 🎯 Overview

This project now has **3 layers of automated code review**:

| Layer | When | Duration | Purpose |
|-------|------|----------|---------|
| **pre-commit** (local) | Before commit | 5-15s | Fast feedback, catch obvious errors |
| **pre-push** (local) | Before push | 30-60s | Full validation, prevent CI failures |
| **GitHub Actions** (remote) | On Pull Request | 2-5min | Team-wide validation, block merge |

## 🚀 Quick Setup (First Time Only)

### Windows
```powershell
.\.githooks\install-hooks.ps1
```

### Linux/Mac
```bash
bash .githooks/install-hooks.sh
```

**Done!** Hooks will now run automatically on every commit and push.

---

## 📋 What Gets Checked

### pre-commit Hook (Fast - 5-15 seconds)
✅ PHP syntax errors  
✅ PSR-12 code formatting (Pint)  
✅ Debugging statements (`dd()`, `dump()`, `var_dump()`)  
✅ Portuguese messages (must be English)  
✅ **CHANGELOG.md** (staging branch only)  
✅ Postman collections JSON validity  

### pre-push Hook (Full - 30-60 seconds)
✅ PHPStan Level 6 static analysis  
✅ All PHPUnit tests (Unit + Feature)  
✅ Uncommitted changes check  
✅ Security audit (composer vulnerabilities)  
✅ `.env.example` up-to-date check  
✅ Branch protection (no direct push to main/production)  

### GitHub Actions (Complete - 2-5 minutes)
✅ All pre-commit + pre-push checks  
✅ Runs on multiple PHP versions (if configured)  
✅ Public CI status visible in Pull Request  
✅ **Blocks merge** if any check fails  

---

## 💡 Common Workflows

### Normal Development Workflow
```bash
# 1. Make changes
vim app/Services/MyService.php

# 2. Commit (pre-commit hook runs automatically)
git add .
git commit -m "feat: add new feature"
# ✅ pre-commit: All checks passed! (12 seconds)

# 3. Push (pre-push hook runs automatically)
git push
# ✅ pre-push: All checks passed! (45 seconds)

# 4. Create Pull Request
# GitHub Actions runs automatically and shows results in PR
```

### If Hook Fails
```bash
git commit -m "fix: something"
# ❌ 2 error(s) detected - commit aborted
#    ❌ Code formatting issues detected
#    💡 Run: vendor/bin/pint

# Fix the issue
vendor/bin/pint

# Try again
git commit -m "fix: something"
# ✅ All pre-commit checks passed!
```

### Emergency Bypass (Not Recommended)
```bash
# Skip pre-commit
git commit --no-verify -m "emergency: hotfix"

# Skip pre-push
git push --no-verify
```

**⚠️ Warning**: Bypassed commits may still fail in GitHub Actions CI!

---

## 🔧 Troubleshooting

### "Vendor directory not found"
```bash
composer install
```

### "Hook not running" (Windows)
Make sure Git Bash is installed:
- Download: https://git-scm.com/download/win
- Or reinstall hooks: `.\.githooks\install-hooks.ps1`

### "Permission denied" (Linux/Mac)
```bash
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
```

### Hooks too slow
```bash
# Disable specific checks by editing hook files
# Or use --no-verify for emergency (not recommended)
```

### PHPStan/Pint issues
```bash
# Update dependencies
composer update

# Clear cache
php artisan cache:clear
php artisan config:clear
```

---

## 📊 Performance Tips

**Optimize local development:**

1. **Install `jq` for faster Postman validation**
   - Windows: `choco install jq`
   - Linux: `sudo apt-get install jq`
   - Mac: `brew install jq`

2. **Keep dependencies updated**
   ```bash
   composer update
   ```

3. **Run Pint on save** (optional)
   - VS Code: Install Laravel Pint extension
   - PHPStorm: Configure External Tool

4. **Commit frequently** (smaller changesets = faster validation)

---

## 🎯 Best Practices

### DO:
✅ Run `vendor/bin/pint` before committing (auto-fix formatting)  
✅ Write tests for new features (prevents pre-push failures)  
✅ Update CHANGELOG.md **only on staging branch**  
✅ Use English for all user-facing messages  
✅ Remove debugging statements before committing  

### DON'T:
❌ Bypass hooks unless emergency (defeats purpose)  
❌ Commit large changesets (slower validation)  
❌ Update CHANGELOG.md on feature branches (will fail)  
❌ Push untested code (will fail in pre-push)  
❌ Ignore hook error messages (fix the root cause)  

---

## 🔗 Related Documentation

- **GitHub Actions Workflow**: [.github/workflows/code-review.yml](.github/workflows/code-review.yml)
- **Git Hooks Details**: [.githooks/README.md](.githooks/README.md)
- **Code Standards**: [.github/copilot-instructions.md](.github/copilot-instructions.md)
- **CHANGELOG Guidelines**: [CHANGELOG.md](CHANGELOG.md)

---

## 🆘 Need Help?

1. **Check hook output** - error messages explain what failed
2. **Read error logs** - hooks show exact file/line numbers
3. **Review documentation** - comprehensive guides in `.githooks/README.md`
4. **Ask team** - someone may have seen the issue before

---

## 📈 Metrics & Impact

**Before automation:**
- ~30% of commits had formatting issues
- ~15% of pushes failed CI
- Average PR review time: 2-4 hours
- Merge conflicts in CHANGELOG.md: frequent

**After automation (expected):**
- < 5% of commits have issues (caught locally)
- < 5% of pushes fail CI (caught in pre-push)
- Average PR review time: 30-60 minutes (less back-and-forth)
- Merge conflicts in CHANGELOG.md: eliminated (staging-only rule)

---

**Last Updated**: January 2026  
**Maintainer**: CCONet Team  
**Project**: Vehicle Passage Processing API
