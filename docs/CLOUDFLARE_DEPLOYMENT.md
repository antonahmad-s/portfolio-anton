# 🚀 CLOUDFLARE DEPLOYMENT GUIDE

## Prerequisites

1. Cloudflare account (free tier is fine)
2. Wrangler CLI installed ✅ (already done)
3. Project built successfully

---

## 🔧 Setup Steps

### 1. Login to Cloudflare

```powershell
wrangler login
```

This will open a browser window for authentication.

### 2. Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://antonahmad.dev
```

### 3. Build Project

```powershell
npm run build
```

### 4. Deploy to Cloudflare Pages

**Option A: Via Wrangler CLI**

```powershell
wrangler pages deploy .next
```

**Option B: Via GitHub Integration (Recommended)**

1. Go to Cloudflare Dashboard > Pages
2. Click "Create a project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Node version**: 18 or higher
5. Set environment variables in dashboard

---

## 🔒 Security Configuration

### Cloudflare Dashboard Settings

1. **SSL/TLS**

   - Mode: Full (strict)
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"
   - Minimum TLS Version: 1.2

2. **Security**

   - Security Level: High
   - Challenge Passage: 30 minutes
   - Browser Integrity Check: On
   - Privacy Pass Support: On
   - Enable "Bot Fight Mode" (free plan)

3. **Speed > Optimization**

   - Auto Minify: Enable all (JS, CSS, HTML)
   - Brotli: On
   - Rocket Loader: Off (can break React)

4. **Caching**

   - Caching Level: Standard
   - Browser Cache TTL: Respect Existing Headers

5. **Network**
   - HTTP/2: On
   - HTTP/3 (with QUIC): On
   - 0-RTT Connection Resumption: On

---

## 🌐 Custom Domain Setup

1. Go to "Custom Domains" in your Pages project
2. Click "Set up a custom domain"
3. Enter your domain: `antonahmad.dev`
4. Cloudflare will provide DNS records to add
5. Wait for DNS propagation (can take 24-48 hours)

---

## 📊 Monitoring & Analytics

### Cloudflare Web Analytics (Free)

1. Dashboard > Analytics > Web Analytics
2. Add your site
3. Copy the beacon script (optional, GA already configured)

### Real User Monitoring

- Available in Cloudflare Dashboard > Speed > Performance

---

## 🔍 Testing Deployment

### Security Headers Test

```powershell
curl -I https://antonahmad.dev
```

Or use online tools:

- https://securityheaders.com
- https://observatory.mozilla.org

### SSL Test

- https://www.ssllabs.com/ssltest/

### Performance Test

- https://pagespeed.web.dev
- https://www.webpagetest.org

---

## 🛠️ Troubleshooting

### Issue: Build fails on Cloudflare

**Solution**: Check Node version

```toml
# Add to wrangler.toml
[build.environment]
NODE_VERSION = "18"
```

### Issue: 404 on refresh

**Solution**: Cloudflare Pages handles Next.js routing automatically. Ensure you're using Next.js 13+ App Router.

### Issue: Environment variables not working

**Solution**:

1. Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side
2. Set in Cloudflare Dashboard, not just `.env.local`

### Issue: Security headers not applied

**Solution**: Check `public/_headers` file is deployed correctly

---

## 📱 Commands Reference

```powershell
# Login
wrangler login

# Logout
wrangler logout

# Deploy
wrangler pages deploy .next

# View deployment logs
wrangler pages deployment list

# View project info
wrangler pages project list

# Delete deployment
wrangler pages deployment delete [deployment-id]
```

---

## 🔄 CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm ci
      - run: npm run build

      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .next --project-name=portfolio-anton
```

**Setup Secrets**:

1. Get API Token: Cloudflare Dashboard > My Profile > API Tokens
2. Get Account ID: Cloudflare Dashboard > Overview (right sidebar)
3. Add to GitHub: Settings > Secrets and variables > Actions

---

## 📋 Post-Deployment Checklist

- [ ] Custom domain configured
- [ ] SSL certificate active (check padlock in browser)
- [ ] Security headers verified (securityheaders.com)
- [ ] Analytics tracking working
- [ ] All pages load correctly
- [ ] Images optimized and loading
- [ ] 404 page works
- [ ] Redirects working (www → non-www)
- [ ] Mobile responsive
- [ ] Performance score > 90 (PageSpeed Insights)

---

## 🆘 Support

- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Community: https://community.cloudflare.com/
- Status: https://www.cloudflarestatus.com/

---

**Deployment Date**: ****\_****  
**Deployed By**: Anton Ahmad Susilo  
**Production URL**: https://antonahmad.dev
