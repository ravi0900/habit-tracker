import React, { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';

const NotificationButton = () => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });
    }
  };

  // Always show if permission is not granted
  if (permission === 'granted') return null;

  return (
    <button
      onClick={handleRequestPermission}
      className="notification-btn"
      aria-label="Enable notifications"
      title="Enable notifications"
      
      style={{
        position: 'fixed',
        bottom: '6rem',
        left: '2rem',
        background: '#fff',
        border: 'none',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        width: 42,
        height: 42,
        padding: 0,
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s',
        zIndex: 100,
      }}
    >
      <FiBell size={24} color="#4facfe" />
      <span className="sr-only">Enable notifications</span>
    </button>
  );
};

export default NotificationButton;
