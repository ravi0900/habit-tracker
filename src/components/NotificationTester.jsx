import React from 'react';

export default function NotificationTester() {
  const sendTestNotification = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.showNotification('Test Notification', {
          body: 'This is a test notification triggered locally.',
          icon: '/logo192.png',
          vibrate: [200, 100, 200],
          requireInteraction: true,
        });
      } else {
        alert('Service worker not registered!');
      }
    } else {
      alert('Service workers are not supported in this browser.');
    }
  };

  return (
    <div style={{ margin: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', background: '#fafafa' }}>
      <h3>Notification Testing (Dev Only)</h3>
      <button onClick={sendTestNotification} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Send Test Notification
      </button>
    </div>
  );
}
