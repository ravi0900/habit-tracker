import React, { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import Header from './components/Header';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import Statistics from './components/Statistics';
import Calendar from './components/Calendar';
import Achievements from './components/Achievements';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HabitDetailsPage from './components/HabitDetailsPage';
import NotFound from './components/NotFound';
import './styles/index.css';

function App() {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');

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
      completedDates: [],
    };
    setHabits(prev => [...prev, newHabit]);
    setShowForm(false);
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
        const isCompleted = !habit.completedDates.some(entry => entry.date === localDate);
        return {
          ...habit,
          completedDates: isCompleted
            ? [...habit.completedDates, { date: localDate, time: localTime, timestamp }]
            : habit.completedDates.filter(entry => entry.date !== localDate)
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

  return (
    <BrowserRouter>
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
                  {showForm && <HabitForm onSave={addHabit} onCancel={() => setShowForm(false)} />}
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
                  <Notification 
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