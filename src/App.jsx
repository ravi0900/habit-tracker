import React, { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import Header from './components/Header';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import Statistics from './components/Statistics';
import Calendar from './components/Calendar';
import Achievements from './components/Achievements';
import AppNotification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HabitDetailsPage from './components/HabitDetailsPage';
import NotFound from './components/NotFound';
import NotificationTester from './components/NotificationTester';
import { subscribeUserToPush } from './utils/push';
import './styles/index.css';

// NotificationPermissionBanner component
function NotificationPermissionBanner({ visible, onRequestPermission, onClose }) {
  if (!visible) return null;
  return (
    <div style={{
      width: '100%',
      background: '#222',
      color: '#fff',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      position: 'relative',
      marginBottom: '0.5rem',
    }}>
      <span style={{ marginRight: 16 }}>
        Enable notifications to get habit reminders!
      </span>
      <button
        onClick={onRequestPermission}
        style={{
          background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.09)',
          marginRight: 16,
        }}
      >
        Enable Notifications
      </button>
      <button
        onClick={onClose}
        aria-label="Close notification banner"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: 22,
          fontWeight: 700,
          cursor: 'pointer',
          position: 'absolute',
          right: 18,
          top: 8,
        }}
      >
        ×
      </button>
    </div>
  );
}

function getNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    const perm = Notification.permission;
    if (perm === 'default' || perm === 'granted' || perm === 'denied') {
      return perm;
    }
  }
  return 'default';
}

function App() {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [bannerClosed, setBannerClosed] = useState(false);
  const [permission, setPermission] = useState(() => getNotificationPermission());

  useEffect(() => {
    if ('Notification' in window) {
      const interval = setInterval(() => {
        const current = getNotificationPermission();
        setPermission(current);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // 1. Initial load from localStorage (independent of auth context)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      const savedHabits = localStorage.getItem(`habits_${storedUser.email}`);
      if (savedHabits) {
        try {
          setHabits(JSON.parse(savedHabits));
        } catch (e) {
          console.error('Corrupted habits data, resetting...');
          localStorage.removeItem(`habits_${storedUser.email}`);
          setHabits([]);
        }
      }
    }
  }, []);

  // 2. Handle auth state changes and data merging
  useEffect(() => {
    if (user?.email) {
      const savedHabits = localStorage.getItem(`habits_${user.email}`);
      if (savedHabits) {
        try {
          const storedHabits = JSON.parse(savedHabits);
          setHabits(prev => {
            const mergedHabits = [...prev, ...storedHabits].reduce((acc, habit) => {
              acc[habit.id] = habit;
              return acc;
            }, {});
            return Object.values(mergedHabits);
          });
        } catch (e) {
          console.error('Failed to merge habits:', e);
        }
      }
    } else {
      setHabits([]);
    }
  }, [user?.email]);

  // 3. Debounced save to localStorage
  useEffect(() => {
    if (!user?.email) return;

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(`habits_${user.email}`, JSON.stringify(habits));
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [habits, user?.email]);

  // Subscribe to push notifications when user enables reminders/notifications
  useEffect(() => {
    if (Notification.permission === 'granted') {
      subscribeUserToPush();
    }
  }, [permission]);

  const showNotification = (message, isReminder = false) => {
    setNotification({ message, isReminder });
    setTimeout(() => setNotification(null), 5000);
  };

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      streak: 0,
      longestStreak: 0,
      completionHistory: [],
    };
    setHabits(prev => [...prev, newHabit]);
    setShowForm(false);
    setBannerClosed(false);
    if (permission === 'default') {
      setShowNotificationBanner(true);
    }
    showNotification('Habit created successfully!');
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    showNotification('Habit deleted successfully!');
  };

  const toggleComplete = (id) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const now = new Date();
        const timestamp = now.getTime(); // epoch ms
        const localDate = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const localTime = now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        // Defensive: ensure completionHistory is always an array
        const history = Array.isArray(habit.completionHistory) ? habit.completionHistory : [];
        const isCompleted = !history.some(entry => entry.date === localDate);
        let updatedCompletionHistory = isCompleted
          ? [...history, { date: localDate, time: localTime, timestamp }]
          : history.filter(entry => entry.date !== localDate);
        // Calculate streak
        let streak = 0;
        let longestStreak = 0;
        let prevDate = null;
        // Sort by date ascending
        const sorted = [...updatedCompletionHistory].sort((a,b) => new Date(a.date) - new Date(b.date));
        sorted.forEach(entry => {
          const entryDate = new Date(entry.date);
          if (prevDate) {
            const diff = (entryDate - prevDate) / (1000*60*60*24);
            if (diff === 1) {
              streak += 1;
            } else if (diff > 1) {
              streak = 1;
            }
          } else {
            streak = 1;
          }
          if (streak > longestStreak) longestStreak = streak;
          prevDate = entryDate;
        });
        return {
          ...habit,
          completionHistory: updatedCompletionHistory,
          streak,
          longestStreak
        };
      }
      return habit;
    }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(habits);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'habits.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHabits = JSON.parse(e.target.result);
        setHabits(importedHabits);
        if (user?.email) {
          localStorage.setItem(`habits_${user.email}`, JSON.stringify(importedHabits));
        }
        showNotification('Habits imported successfully!');
      } catch (error) {
        showNotification('Error importing habits!');
      }
    };
    reader.readAsText(file);
  };

  const handleRequestPermission = () => {
    if (
      'Notification' in window &&
      permission === 'default'
    ) {
      try {
        console.log('[DEBUG] Notification object:', Notification);
        console.log('[DEBUG] Notification.requestPermission:', Notification.requestPermission);
        Notification.requestPermission().then((result) => {
          setPermission(result);
          setShowNotificationBanner(false);
          setBannerClosed(true);
          if (result === 'denied') {
            alert('Notifications are blocked. Please enable them in your browser settings for this site.');
          }
        }).catch((err) => {
          alert('Unable to request notification permissions. Please check your browser settings.');
          console.error('Notification.requestPermission error:', err);
        });
      } catch (err) {
        alert('Notification.requestPermission() could not be called. Please check your browser or environment.');
        console.error('Notification.requestPermission error:', err);
      }
    } else if ('Notification' in window && permission === 'denied') {
      alert('Notifications are blocked. Please enable them in your browser settings for this site.');
    } else if (!('Notification' in window)) {
      alert('Notifications are not supported in your browser.');
    }
  };

  const handleCloseBanner = () => {
    setShowNotificationBanner(false);
    setBannerClosed(true);
  };

  // Debug log for all relevant state
  console.log('[App] render', {
    showNotificationBanner,
    bannerClosed,
    permission
  });

  return (
    <BrowserRouter>
      <NotificationPermissionBanner
        visible={showNotificationBanner && !bannerClosed && permission === 'default'}
        onRequestPermission={handleRequestPermission}
        onClose={handleCloseBanner}
      />
      {/* Notification Testing Panel */}
      {import.meta.env.VITE_SHOW_NOTIFICATION_TESTER === 'true' && <NotificationTester />}
      <Routes>
        <Route path="/" element={
          <div className="app">
            <ThemeToggle />
            {!user ? (
              <div className="auth-container">
                {showLogin ? (
                  <LoginForm onToggleForm={() => setShowLogin(false)} />
                ) : (
                  <SignupForm onToggleForm={() => setShowLogin(true)} />
                )}
              </div>
            ) : (
              <>
                <Header
                  onAddClick={() => setShowForm(true)}
                  onExport={handleExport}
                  onImport={handleImport}
                />
                <div className="app-container">
                  <div className="tab-navigation">
                    <button 
                      className={`tab-button ${activeTab === 'habits' ? 'active' : ''}`}
                      onClick={() => setActiveTab('habits')}
                    >
                      Habits
                    </button>
                    <button 
                      className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                      onClick={() => setActiveTab('stats')}
                    >
                      Stats
                    </button>
                    <button 
                      className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('calendar')}
                    >
                      Calendar
                    </button>
                    <button 
                      className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
                      onClick={() => setActiveTab('achievements')}
                    >
                      Achievements
                    </button>
                  </div>
                  {showForm && <HabitForm onSubmit={addHabit} onCancel={() => setShowForm(false)} />}
                  {activeTab === 'habits' && (
                    <HabitList
                      habits={habits}
                      onToggleComplete={toggleComplete}
                      onDelete={deleteHabit}
                    />
                  )}
                  {activeTab === 'stats' && <Statistics habits={habits} />}
                  {activeTab === 'calendar' && <Calendar habits={habits} />}
                  {activeTab === 'achievements' && <Achievements habits={habits} />}
                </div>
                {notification && (
                  <AppNotification 
                    message={notification.message}
                    isReminder={notification.isReminder}
                  />
                )}
              </>
            )}
          </div>
        } />
        <Route path="/habit/:id" element={
          <HabitDetailsPage habits={habits} onToggleComplete={toggleComplete} onDelete={deleteHabit} />
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;