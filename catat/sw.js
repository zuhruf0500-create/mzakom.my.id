// Simpan berkas aplikasi agar bisa dibuka tanpa internet. Naikkan VERSI tiap ada pembaruan.
const VERSI = 'catat-usaha-3';
const BERKAS = ['./', 'index.html', 'manifest.webmanifest', 'ikon-192.png', 'ikon-512.png', 'jakarta.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(BERKAS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSI).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  // utamakan internet (dapat versi terbaru), jatuh ke simpanan saat offline
  e.respondWith(fetch(e.request).then(r => {
    const salin = r.clone();
    caches.open(VERSI).then(c => c.put(e.request, salin));
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
