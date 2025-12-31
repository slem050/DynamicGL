# Deployment Guide

This guide explains how to publish packages to npm and deploy the documentation site.

## Publishing to NPM

### Prerequisites

1. Create an npm account at https://www.npmjs.com
2. Create an npm access token:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create a new "Automation" token
   - Copy the token

### Setup

1. **Add NPM token to GitHub Secrets:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add a new secret: `NPM_TOKEN` with your npm token

2. **Update repository URLs in package.json files:**
   - Replace `slem050` with your GitHub username in all package.json files

### Publishing

**Option 1: Automatic (via GitHub Actions)**
- Create a new GitHub Release
- The `publish.yml` workflow will automatically publish all packages to npm

**Option 2: Manual**
```bash
# Login to npm
npm login

# Build all packages
pnpm build:packages

# Publish each package
cd packages/core && npm publish --access public
cd ../charts && npm publish --access public
cd ../theme && npm publish --access public
cd ../react && npm publish --access public
```

## Deploying Documentation Site

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Get Vercel tokens:**
   - Go to https://vercel.com/account/tokens
   - Create a new token

4. **Add to GitHub Secrets:**
   - `VERCEL_TOKEN` - Your Vercel token
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID

5. **Deploy:**
   - Push to main branch → Auto-deploys via GitHub Actions
   - Or run `vercel --prod` from `apps/docs-site`

### Option 2: Netlify

1. **Build command:** `pnpm build:packages && pnpm --filter docs-site build`
2. **Publish directory:** `apps/docs-site/.next`
3. **Node version:** 18

### Option 3: GitHub Pages

Update `.github/workflows/deploy-docs.yml` to use GitHub Pages action instead.

## Using Published Packages

Once published, you can install the packages:

```bash
npm install @dynamicgl/react @dynamicgl/core @dynamicgl/charts @dynamicgl/theme
```

Or with pnpm:
```bash
pnpm add @dynamicgl/react @dynamicgl/core @dynamicgl/charts @dynamicgl/theme
```

## Development vs Production

- **Development:** Uses workspace packages (`workspace:*`)
- **Production:** Uses published npm packages

The docs site automatically uses workspace packages during development, but you can test with published packages by updating `package.json` in `apps/docs-site`.

