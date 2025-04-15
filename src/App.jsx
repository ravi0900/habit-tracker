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
import './styles/index.css';

function App() {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');

  // Load user's habits when user changes
  useEffect(() => {
    if (user) {
      const savedHabits = localStorage.getItem(`habits_${user.email}`);
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    }
  }, [user]);

  // Save habits when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`habits_${user.email}`, JSON.stringify(habits));
    }
  }, [habits, user]);

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
        const today = new Date().toISOString().split('T')[0];
        const isCompleted = !habit.completedDates.includes(today);
        
        return {
          ...habit,
          completedDates: isCompleted 
            ? [...habit.completedDates, today]
            : habit.completedDates.filter(date => date !== today)
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
        showNotification('Habits imported successfully!');
      } catch (error) {
        showNotification('Error importing habits!');
      }
    };
    reader.readAsText(file);
  };

  return (
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
                Statistics
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

            {showForm && (
              <HabitForm 
                onSubmit={addHabit}
                onCancel={() => setShowForm(false)}
              />
            )}

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
  );
}

export default App;
