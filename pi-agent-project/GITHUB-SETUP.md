# 🚀 GitHub Setup Guide

Hướng dẫn chi tiết để push project lên GitHub và setup CI/CD.

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Git installed
- [ ] GitHub CLI (optional but recommended)

---

## 🔧 Setup Steps

### Step 1: Create GitHub Repository

#### Option A: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not installed
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Login to GitHub
gh auth login

# Create repository
gh repo create pi-agent-core --public --source=. --remote=origin
```

#### Option B: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `pi-agent-core`
3. Description: `AI Agent Framework with Multi-Agent Orchestration`
4. Visibility: Public
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

---

### Step 2: Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit with Pi Agent Core"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/pi-agent-core.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 3: Configure GitHub Secrets

Go to your repository on GitHub:
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add these secrets:

#### Required Secrets

```bash
# OpenAI API Key
Name: OPENAI_API_KEY
Value: sk-your-openai-api-key

# Anthropic API Key (optional)
Name: ANTHROPIC_API_KEY
Value: sk-ant-your-anthropic-api-key

# AI-Box API Key (optional)
Name: AIBOX_API_KEY
Value: sk-your-aibox-api-key
```

#### Optional Secrets

```bash
# For npm publishing
Name: NPM_TOKEN
Value: your-npm-token

# For deployment
Name: DEPLOY_TOKEN
Value: your-deploy-token

# For code coverage
Name: CODECOV_TOKEN
Value: your-codecov-token
```

---

### Step 4: Enable GitHub Actions

1. Go to repository on GitHub
2. Click `Actions` tab
3. If prompted, click "I understand my workflows, go ahead and enable them"
4. You should see your workflows:
   - CI/CD Pipeline
   - Auto Release
   - Dependency Updates
   - Deploy Documentation

---

### Step 5: Configure Branch Protection

1. Go to `Settings` → `Branches`
2. Click `Add branch protection rule`
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators
5. Click `Create`

---

### Step 6: Add Repository Topics

1. Go to repository main page
2. Click gear icon next to "About"
3. Add topics:
   - `ai`
   - `agent`
   - `multi-agent`
   - `orchestration`
   - `pipeline`
   - `workflow`
   - `javascript`
   - `nodejs`
   - `openai`
   - `anthropic`

---

### Step 7: Configure GitHub Pages (Optional)

For documentation:

1. Go to `Settings` → `Pages`
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` / `root`
4. Click `Save`
5. Documentation will be available at:
   `https://YOUR_USERNAME.github.io/pi-agent-core/`

---

## 🔄 CI/CD Workflow

### What happens automatically:

#### On Push to `main` or `develop`:
```
✅ Run tests on Node 18, 20, 22
✅ Run linter
✅ Build project
✅ Security audit
✅ Deploy to production (main only)
```

#### On Pull Request:
```
✅ Run tests
✅ Run linter
✅ Build project
✅ Security audit
```

#### On Tag Push (v*.*.*):
```
✅ Create GitHub release
✅ Generate changelog
✅ Upload release assets
✅ Publish to npm
```

#### Weekly (Monday):
```
✅ Check for dependency updates
✅ Create PR with updates
```

#### On Documentation Changes:
```
✅ Build documentation
✅ Deploy to GitHub Pages
```

---

## 📊 Monitoring

### Check Workflow Status

```bash
# Using GitHub CLI
gh run list
gh run view <run-id>

# Or visit:
# https://github.com/YOUR_USERNAME/pi-agent-core/actions
```

### View Logs

```bash
# Using GitHub CLI
gh run view <run-id> --log

# Or view in GitHub Actions tab
```

### Check Deployment

```bash
# View deployment status
gh api repos/YOUR_USERNAME/pi-agent-core/deployments

# Or check GitHub Pages
# https://YOUR_USERNAME.github.io/pi-agent-core/
```

---

## 🎯 Best Practices

### 1. Commit Messages

```bash
# ✅ Good
git commit -m "feat: add multi-agent orchestration"
git commit -m "fix: resolve memory leak in pipeline"
git commit -m "docs: update README with examples"

# ❌ Bad
git commit -m "update"
git commit -m "fix bug"
git commit -m "WIP"
```

### 2. Branch Strategy

```bash
# Main branch
main              # Production-ready code
develop           # Integration branch

# Feature branches
feature/auth      # New authentication feature
feature/pipeline  # New pipeline feature

# Bug fix branches
fix/memory-leak   # Fix memory leak
fix/api-timeout   # Fix API timeout
```

### 3. Pull Request Process

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
git add .
git commit -m "feat: add new feature"

# 3. Push to GitHub
git push origin feature/new-feature

# 4. Create PR
gh pr create --title "Add new feature" --body "Description of changes"

# 5. Wait for review and CI checks

# 6. Merge after approval
gh pr merge --squash
```

---

## 🔐 Security

### Never Commit:
- ❌ API keys
- ❌ Passwords
- ❌ Private keys
- ❌ Database credentials
- ❌ `.env` files

### Always Use:
- ✅ GitHub Secrets
- ✅ Environment variables
- ✅ `.gitignore`
- ✅ Secret scanning

---

## 📦 Release Process

### Create a Release

```bash
# 1. Update version in package.json
npm version patch  # 1.0.0 → 1.0.1
# or
npm version minor  # 1.0.0 → 1.1.0
# or
npm version major  # 1.0.0 → 2.0.0

# 2. Push tag
git push origin main --tags

# 3. GitHub Actions will automatically:
#    - Create release
#    - Generate changelog
#    - Upload assets
#    - Publish to npm
```

---

## 🐛 Troubleshooting

### Issue: "Permission denied"

```bash
# Check SSH keys
ssh -T git@github.com

# Or use HTTPS
git remote set-url origin https://github.com/YOUR_USERNAME/pi-agent-core.git
```

### Issue: "Workflow not running"

```bash
# Check if Actions are enabled
# Repository → Settings → Actions → General

# Check workflow file syntax
# .github/workflows/*.yml
```

### Issue: "Secrets not working"

```bash
# Verify secrets are set
# Repository → Settings → Secrets → Actions

# Check secret names match workflow
# OPENAI_API_KEY in secrets = OPENAI_API_KEY in workflow
```

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Checklist

After completing this guide, you should have:

- [x] Repository created on GitHub
- [x] Code pushed to GitHub
- [x] CI/CD workflows configured
- [x] GitHub secrets added
- [x] Branch protection enabled
- [x] Topics added
- [x] Documentation deployed
- [x] First workflow run successful

---

**Chúc mừng! Project của bạn đã sẵn sàng trên GitHub! 🎉**
