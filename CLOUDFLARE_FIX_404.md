# 🔧 CLOUDFLARE PAGES - 404 FIX

## ❌ MASALAH

Website menampilkan **404 error** di `portfolio-anton.pages.dev`

## ✅ ROOT CAUSE

Next.js default menggunakan **Server-Side Rendering (SSR)**, tapi Cloudflare Pages membutuhkan **Static HTML Export**.

---

## 🛠️ PERBAIKAN YANG SUDAH DILAKUKAN

### 1. Update `next.config.ts` ✅

```typescript
const nextConfig: NextConfig = {
  output: 'export', // ← CRITICAL: Enable static export
  images: {
    unoptimized: true, // ← Required for static export
  },
  // ... rest of config
};
```

### 2. Build Output Directory ✅

- **Before**: `.next/` (SSR output)
- **After**: `out/` (Static HTML)

### 3. Git Commit & Push ✅

Perubahan sudah di-commit dan push ke GitHub.

---

## ⚙️ WAJIB: UPDATE CLOUDFLARE DASHBOARD

### Step-by-Step:

1. **Go to Cloudflare Dashboard**

   ```
   https://dash.cloudflare.com
   → Workers & Pages
   → portfolio-anton
   ```

2. **Settings > Builds & deployments**

3. **Click "Edit configuration"**

4. **Update Build output directory:**

   ```
   OLD: .next ❌
   NEW: out   ✅
   ```

5. **Click "Save"**

6. **Trigger Rebuild:**

   - Go to **Deployments** tab
   - Click **"Retry deployment"** pada latest failed build

   **OR**

   - Click **"Create deployment"**
   - Select branch: `main`
   - Click **"Deploy"**

---

## 📋 BUILD SETTINGS SUMMARY

| Setting                    | Value                        |
| -------------------------- | ---------------------------- |
| **Framework preset**       | Next.js (Static HTML Export) |
| **Build command**          | `npm run build`              |
| **Build output directory** | `out` ✅                     |
| **Node version**           | 20                           |

---

## ⏱️ TIMELINE

- **Build time**: ~2-3 menit
- **Deploy time**: ~1 menit
- **DNS propagation**: Instant (already configured)
- **Total**: ~5 menit

---

## ✅ VERIFICATION

Setelah deployment selesai:

1. **Check Deployment Status**

   - Cloudflare Dashboard > Deployments
   - Status harus: ✅ **Success**

2. **Test Website**

   ```
   https://portfolio-anton.pages.dev
   ```

   - Should load homepage ✅
   - No more 404 ✅

3. **Check Console**
   - Browser DevTools > Console
   - No errors ✅

---

## 🔍 TROUBLESHOOTING

### Issue: Build still fails

**Check build logs in Cloudflare:**

- Dashboard > Deployments > Click on deployment > View logs

### Issue: Still showing 404 after rebuild

**Hard refresh browser:**

- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Or clear cache:**

- Cloudflare Dashboard > Caching > Purge Everything

---

## 📚 REFERENCES

- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Cloudflare Pages: https://developers.cloudflare.com/pages/framework-guides/nextjs/

---

**Last Updated**: December 17, 2025  
**Status**: Fix committed, waiting for Cloudflare rebuild
