// @ts-nocheck
const sw = self as any;


// To disable all workbox logging during development
sw.__WB_DISABLE_DEV_LOGS = true;

// Listen to push events
sw.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new message.",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
  };
  event.waitUntil(sw.registration.showNotification(title, options));
});

// Listen to background sync events
sw.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    // Perform background sync
    event.waitUntil(Promise.resolve());
  }
});

// Listen to periodic background sync events
// @ts-expect-error - periodicsync is not strictly typed in standard TS DOM lib yet
sw.addEventListener("periodicsync", (event: any) => {
  if (event.tag === "periodic-sync-data") {
    // Perform periodic background sync
    event.waitUntil(Promise.resolve());
  }
});

// Listen to notification click
sw.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    sw.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) return client.focus();
      }
      if (sw.clients.openWindow) return sw.clients.openWindow("/");
    })
  );
});
