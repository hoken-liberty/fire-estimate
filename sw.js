const CACHE_NAME = 'fire-insurance-v1';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'sw.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// インストールイベント: アプリシェルをキャッシュする
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチイベント: キャッシュからリソースを供給し、オフライン対応を可能にする
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにリソースがあればそれを使用
        if (response) {
          return response;
        }
        // キャッシュになければネットワークから取得
        return fetch(event.request).catch(() => {
          // ネットワークも利用できない場合のフォールバック (例: オフラインページ)
          // 現状はオフラインページは設定していませんが、必要に応じて追加できます。
          console.log('Offline: No cache and no network for', event.request.url);
        });
      })
  );
});

// アクティベートイベント: 古いキャッシュをクリアする
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 古いキャッシュを削除
          }
        })
      );
    })
  );
});
