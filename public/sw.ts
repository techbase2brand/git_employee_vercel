declare const self: ServiceWorkerGlobalScope & typeof globalThis;

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json();
  if (data) {
    self.registration.showNotification(data.title, {
      body: data.message,
    });
  }
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/dashboard'));

});

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service worker installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

export {};
