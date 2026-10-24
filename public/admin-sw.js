/* Dogtor employee admin service worker (scope /admin/).
   Shows Web Push notifications and opens the linked page when one is tapped.
   No caching: admin data must always come from the server. */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))

// A fetch handler keeps the app installable; requests go straight to the network.
self.addEventListener('fetch', () => {})

self.addEventListener('push', event => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch { data = { title: event.data && event.data.text() } }
  const title = data.title || 'Dogtor 團隊工作台'
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    icon: '/admin-icon-192.png',
    badge: '/admin-icon-192.png',
    tag: data.id ? `admin-${data.id}` : undefined,
    data: { url: data.url || '/admin' },
  }))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || '/admin', self.location.origin).href
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const open = windows.find(w => w.url.startsWith(self.location.origin + '/admin'))
    if (open) { await open.focus(); return open.navigate(url) }
    return self.clients.openWindow(url)
  })())
})
