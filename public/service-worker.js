self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/logo192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true // Notification stays until user dismisses
  };
  event.waitUntil(
    self.registration.showNotification('Habit Tracker', options)
  );
});
