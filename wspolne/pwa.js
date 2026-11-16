// Rejestruje service worker (działanie bez internetu, instalacja na telefonie).
// Dołączaj na każdej stronie: <script src="(ścieżka do)wspolne/pwa.js" defer></script>
(function () {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;
  var root = new URL('../', document.currentScript.src); // katalog główny serwisu
  window.addEventListener('load', function () {
    navigator.serviceWorker.register(new URL('sw.js', root), { scope: root.pathname }).catch(function () {});
  });
})();
