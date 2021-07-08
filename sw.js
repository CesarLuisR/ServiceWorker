if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("./sw.js");

// --------------------------------------------------------------------- //

const CACHE_NAME = 'cache-name';

// files
urlsToCache = [

];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      )
      .catch(err => console.log('Falló registro de cache', err))
  )
})

self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) caches.delete(cacheName)
          })
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(resp => {
        if (resp) resp
        return fetch(e.request)
      })
  )
})
