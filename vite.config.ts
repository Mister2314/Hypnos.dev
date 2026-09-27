import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * CSP meta — YALNIZ production build-ə (`apply: 'build'`).
 *
 * ⚠️ Niyə dev-də YOX: Vite dev-də CSS-i JS ilə `<style>` teqləri kimi yeridir,
 * `style-src 'self'` isə onları bloklayır → sayt stilsiz açılır. Bu, 26 sentyabrda
 * real oldu: dev-də `h1` 32px/Times New Roman göstərirdi. Production build-də isə
 * CSS ayrı fayldır (`/assets/*.css`) → `style-src 'self'` heç nəyi sındırmır.
 *
 * `frame-ancestors` meta ilə İŞLƏMİR (spec belədir) — deploy zamanı HTTP başlığı
 * ilə verilməlidir (məs. `vercel.json` → headers). Meta versiyası onu daşımır.
 */
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; " +
  "img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'"

function cspMeta(): Plugin {
  return {
    name: 'csp-meta-build-only',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `  <meta http-equiv="Content-Security-Policy" content="${CSP}" />\n  </head>`,
      )
    },
  }
}

// `base: './'` — nisbi yollar. `dist` həm kökdən (Vercel), həm fayl kimi (file://) işləyir.
// Runtime-da şəkillər `import.meta.env.BASE_URL` ilə yığılır (bax: Marble.tsx, Summer.tsx).
export default defineConfig({
  base: './',
  plugins: [react(), cspMeta()],
})
