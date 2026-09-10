import { cpSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const result = spawnSync(process.execPath, ['node_modules/expo/bin/cli', 'export', '-p', 'web', '--output-dir', 'dist/uygulama'], {
  stdio: 'inherit', env: { ...process.env, ZIKR_SITE_BUILD: '1' },
});
if (result.status !== 0) process.exit(result.status ?? 1);
cpSync('website', 'dist', { recursive: true });
const appDir = 'dist/uygulama';
let html = readFileSync(`${appDir}/index.html`, 'utf8');
const ioniconsPath = `${appDir}/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts`;
const ioniconsFile = readdirSync(ioniconsPath).find((file) => file.startsWith('Ionicons.') && file.endsWith('.ttf'));
if (!ioniconsFile) throw new Error('Ionicons web font bulunamadı.');
const fontUrl = `/uygulama/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/${ioniconsFile}`;
html = html.replace('</head>', `<style>@font-face{font-family:Ionicons;src:url('${fontUrl}') format('truetype');font-display:block}#root{box-sizing:border-box;padding-top:44px}</style></head>`).replace('href="/manifest.json"', 'href="/uygulama/manifest.json"')
  .replace('href="/apple-touch-icon.png"', 'href="/uygulama/apple-touch-icon.png"')
  .replace("register('/sw.js')", "register('/uygulama/sw.js', { scope: '/uygulama/' })")
  .replace('<body>', '<body><a href="/" aria-label="Site ana sayfasına dön" style="position:fixed;top:8px;left:12px;z-index:9999;color:#0E6F5C;background:#F7F3EA;padding:6px 10px;border-radius:20px;font:13px system-ui;text-decoration:none">← Ana sayfa</a>')
  .replace('You need to enable JavaScript to run this app.', 'Uygulamayı kullanmak için JavaScript’i etkinleştirin.');
writeFileSync(`${appDir}/index.html`, html);
const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
Object.assign(manifest, { id: '/uygulama/', start_url: '/uygulama/', scope: '/uygulama/' });
writeFileSync(`${appDir}/manifest.json`, JSON.stringify(manifest, null, 2));
let sw = readFileSync('public/sw.js', 'utf8')
  .replace('__PWA_CACHE_VERSION__', `site-${Date.now()}`)
  .replaceAll("'/", "'/uygulama/")
  .replace('key !== CACHE_NAME', "key.startsWith('zikr-defteri-') && key !== CACHE_NAME")
  .replace("if (event.request.method !== 'GET')", "if (event.request.method !== 'GET' || !new URL(event.request.url).pathname.startsWith('/uygulama/'))")
  .replace('if (isSameOrigin) {', "if (isSameOrigin && event.request.mode === 'navigate') {");
writeFileSync(`${appDir}/sw.js`, sw);
writeFileSync('dist/_redirects', '/uygulama /uygulama/ 301\n');
writeFileSync('dist/_headers', '/\n  Cache-Control: no-cache\n/index.html\n  Cache-Control: no-cache\n/uygulama/sw.js\n  Cache-Control: no-cache\n/uygulama/index.html\n  Cache-Control: no-cache\n');
console.log('Site hazır: dist (ana sayfa, gizlilik, /uygulama/)');
