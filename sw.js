// Service worker: strony i pliki z tego serwisu są zapisywane po pierwszym otwarciu,
// więc odwiedzone quizy działają też bez internetu.
// Strategia: najpierw sieć (świeża wersja), a gdy jej brak – kopia z pamięci.
// Zmień WERSJA, jeśli chcesz wymusić wyczyszczenie starej pamięci.
const WERSJA = 'quizy-v1';
const NA_START = ['./', './index.html', './wspolne/styl.css', './wspolne/pwa.js', './manifest.webmanifest', './wspolne/ikona.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(WERSJA).then((c) => c.addAll(NA_START)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== WERSJA).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const swoj = url.origin === location.origin;
  const czcionki = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!swoj && !czcionki) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const kopia = res.clone();
          caches.open(WERSJA).then((c) => c.put(req, kopia));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
  );
});
