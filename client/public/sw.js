// ProductivityPro Service Worker
// Version 1.0.0

const CACHE_NAME = 'productivitypro-v1.0.0';
const OFFLINE_URL = '/';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // Note: Vite handles most bundled assets, so we'll cache them on request
];

// Routes that should always go to network first
const NETWORK_FIRST_ROUTES = [
  '/api/',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      try {
        await cache.addAll(STATIC_ASSETS);
        console.log('Static assets cached successfully');
      } catch (error) {
        console.error('Failed to cache static assets:', error);
      }
      
      // Skip waiting to activate immediately
      await self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
      
      // Claim all clients
      await self.clients.claim();
      
      console.log('Service worker activated');
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip extension and external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(handleFetch(event.request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  // Network first for API routes
  if (NETWORK_FIRST_ROUTES.some(route => url.pathname.startsWith(route))) {
    return networkFirst(request);
  }
  
  // Cache first for static assets
  if (isStaticAsset(url)) {
    return cacheFirst(request);
  }
  
  // Stale while revalidate for HTML pages
  if (request.destination === 'document') {
    return staleWhileRevalidate(request);
  }
  
  // Default to cache first
  return cacheFirst(request);
}

// Network first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed, return cached version if available
    return cachedResponse;
  });
  
  // Return cached version immediately if available
  return cachedResponse || fetchPromise;
}

// Check if URL is for a static asset
function isStaticAsset(url) {
  const staticExtensions = [
    '.js', '.css', '.woff', '.woff2', '.ttf', '.eot',
    '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.webp', '.json'
  ];
  
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'productivity-sync') {
    event.waitUntil(syncProductivityData());
  }
});

async function syncProductivityData() {
  try {
    // In a real app, this would sync pending changes to a server
    // For this offline-first app, we'll just update analytics
    console.log('Background sync triggered');
    
    // Notify all clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-48.png',
    data: data.data,
    actions: data.actions || [],
    tag: data.tag || 'productivity-notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });
      
      // Focus existing window or open new one
      if (clients.length > 0) {
        const client = clients[0];
        await client.focus();
        
        // Send action to client
        client.postMessage({
          type: 'NOTIFICATION_ACTION',
          action,
          data
        });
      } else {
        // Open new window
        const url = action === 'add-task' ? '/?action=add-task' : '/';
        await self.clients.openWindow(url);
      }
    })()
  );
});

// Share target handler (for future use)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share-target' && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || '';
    
    // Store shared content for pickup by the app
    const cache = await caches.open('shared-content');
    const shareData = {
      title,
      text,
      url,
      timestamp: Date.now()
    };
    
    await cache.put('/shared-content', new Response(JSON.stringify(shareData)));
    
    // Redirect to app
    return Response.redirect('/', 302);
  } catch (error) {
    console.error('Share target error:', error);
    return Response.redirect('/', 302);
  }
}

// Periodic background sync (for future use)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'productivity-analytics') {
    event.waitUntil(updateAnalytics());
  }
});

async function updateAnalytics() {
  try {
    console.log('Periodic analytics update');
    
    // Notify clients to update their analytics
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_ANALYTICS',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Analytics update failed:', error);
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_UPDATE':
      // Force update of cached resources
      event.waitUntil(updateCache());
      break;
      
    case 'REQUEST_SYNC':
      // Request background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        self.registration.sync.register('productivity-sync');
      }
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  // Update cached resources
  await Promise.all(
    requests.map(async (request) => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.warn('Failed to update cached resource:', request.url);
      }
    })
  );
}

console.log('ProductivityPro Service Worker loaded');
