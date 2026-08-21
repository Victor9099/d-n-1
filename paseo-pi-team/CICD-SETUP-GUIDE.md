# 🚀 CI/CD Setup Guide - Paseo Pi Team

Hướng dẫn thiết lập CI/CD cho project Paseo Pi Team

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [GitHub Actions Workflows](#github-actions-workflows)
3. [Setup Steps](#setup-steps)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Troubleshooting](#troubleshooting)

---

## 📦 Tổng quan

### CI/CD Pipeline bao gồm:

```
┌─────────────────────────────────────┐
│  Code Push / Pull Request          │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  1. Install Dependencies           │
│  2. Run Tests                      │
│  3. Lint Code                      │
│  4. Build Project                  │
│  5. Security Audit                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Deploy (nếu là main branch)       │
└─────────────────────────────────────┘
```

---

## 🔄 GitHub Actions Workflows

### Workflow 1: CI Pipeline (ci.yml)

**Trigger:** Push/PR to main/develop

```yaml
Name: CI Pipeline
Jobs:
  - install: Cài đặt dependencies
  - test: Chạy tests
  - lint: Kiểm tra code style
  - build: Build project
  - security: Security audit
```

---

### Workflow 2: Release (release.yml)

**Trigger:** Tag push (v*.*.*)

```yaml
Name: Release
Jobs:
  - build: Build project
  - release: Tạo GitHub release
  - publish: Publish to npm (optional)
```

---

### Workflow 3: Dependency Updates (deps.yml)

**Trigger:** Weekly (Monday)

```yaml
Name: Dependency Updates
Jobs:
  - update: Check for updates
  - pr: Create PR with updates
```

---

## 🛠️ Setup Steps

### Step 1: Tạo GitHub Repository

```bash
# Nếu chưa có remote
git remote add origin https://github.com/YOUR_USERNAME/paseo-pi-team.git
```

---

### Step 2: Push code lên GitHub

```bash
# Add tất cả files
git add .

# Commit
git commit -m "feat: add CI/CD workflows"

# Push
git push origin main
```

---

### Step 3: Configure GitHub Secrets

Vào **Settings** → **Secrets and variables** → **Actions**

Thêm các secrets:

```bash
# OpenAI API Key (nếu cần)
OPENAI_API_KEY=sk-your-key

# Anthropic API Key (nếu cần)
ANTHROPIC_API_KEY=sk-ant-your-key

# NPM Token (nếu publish to npm)
NPM_TOKEN=your-npm-token

# Deploy Token (nếu deploy)
DEPLOY_TOKEN=your-deploy-token
```

---

### Step 4: Enable Branch Protection

**Settings** → **Branches** → **Add branch protection rule**

Branch: `main`

Enable:
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

---

## ⚙️ Configuration

### File: `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linter
      run: npm run lint --if-present
```

---

### File: `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build --if-present
    
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false
```

---

### File: `.github/workflows/deps.yml`

```yaml
name: Dependency Updates

on:
  schedule:
    - cron: '0 0 * * 1'  # Every Monday
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    
    - name: Update dependencies
      run: |
        npx npm-check-updates -u
        npm install
    
    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v5
      with:
        commit-message: 'chore: update dependencies'
        title: 'chore: update dependencies'
        body: 'Automated dependency updates'
        branch: 'dependency-updates'
```

---

## 📊 Usage

### Xem workflow runs

```bash
# GitHub CLI
gh run list
gh run view <run-id>

# Hoặc vào Actions tab trên GitHub
```

---

### Trigger workflow thủ công

```bash
# GitHub CLI
gh workflow run ci.yml

# Hoặc vào Actions tab → Run workflow
```

---

### Xem logs

```bash
# GitHub CLI
gh run view <run-id> --log

# Hoặc vào Actions tab → Job → View logs
```

---

## 🔍 Troubleshooting

### Error: "Workflow not found"

```bash
# Kiểm tra file workflow
ls -la .github/workflows/

# Đảm bảo file có extension .yml hoặc .yaml
```

---

### Error: "Secrets not available"

```bash
# Vào Settings → Secrets → Actions
# Thêm secrets cần thiết
```

---

### Error: "Branch protection failed"

```bash
# Vào Settings → Branches
# Cấu hình branch protection rules
```

---

### Error: "Tests failed"

```bash
# Chạy tests locally
npm test

# Fix lỗi trước khi push
```

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

## ✅ Checklist

- [ ] Tạo .github/workflows/ directory
- [ ] Thêm ci.yml workflow
- [ ] Thêm release.yml workflow
- [ ] Thêm deps.yml workflow
- [ ] Push code lên GitHub
- [ ] Configure GitHub secrets
- [ ] Enable branch protection
- [ ] Test workflow runs

---

**CI/CD đã sẵn sàng! 🚀**
