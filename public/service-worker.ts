declare const self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event: MessageEvent) => {
  const { title, options } = event.data;

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i] as WindowClient;
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow ) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// This line is required for the TypeScript compiler to treat this file as a module.
export {};
