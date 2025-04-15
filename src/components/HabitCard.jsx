import React, { useContext } from 'react';
import { FaFire, FaTrash, FaCheck, FaClock, FaTag, FaRegCalendarCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { ThemeContext } from '../context/ThemeContext';

const HabitCard = ({ habit, onDelete, onToggleComplete }) => {
  const { darkMode } = useContext(ThemeContext);
  const { 
    id, 
    name, 
    description, 
    category,
    frequency,
    completedDates = [],
    reminderTime 
  } = habit;

  // Check if habit is completed today
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = completedDates.includes(today);

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < 366; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (completedDates.includes(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();
  const lastCompleted = completedDates.length > 0 ? 
    new Date(Math.max(...completedDates.map(date => new Date(date)))) : null;

  // Calculate completion percentage for current month
  const calculateMonthCompletion = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    
    let total = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      if (date > now) break; // Don't count future days
      
      const dateStr = date.toISOString().split('T')[0];
      if (completedDates.includes(dateStr)) {
        total++;
      }
    }
    
    const daysPassed = Math.min(now.getDate(), daysInMonth);
    return Math.round((total / daysPassed) * 100);
  };
  
  const completionPercentage = calculateMonthCompletion();

  return (
    <div className={`habit-card ${darkMode ? 'dark' : ''} ${isCompletedToday ? 'completed-today' : ''}`}>
      <div className="habit-card-header">
        <h3>{name}</h3>
        <button 
          className="delete-btn" 
          onClick={() => onDelete(id)}
          aria-label="Delete habit"
          title="Delete habit"
        >
          <FaTrash />
        </button>
      </div>
      
      {description && <p className="description">{description}</p>}
      
      <div className="habit-meta">
        <div className="habit-info">
          <div className="info-item" title="Category">
            <FaTag className="icon" />
            <span>{category}</span>
          </div>
          <div className="info-item" title="Frequency">
            <FaClock className="icon" />
            <span>{frequency}</span>
          </div>
        </div>
        
        <div className="habit-stats">
          <div className="streak-badge" title={`Current streak: ${streak} days`}>
            <FaFire className={`icon ${streak > 5 ? 'streak-hot' : ''}`} /> 
            <span>{streak}</span>
          </div>
          
          <div className="completion-progress" title={`${completionPercentage}% completed this month`}>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span>{completionPercentage}%</span>
          </div>
        </div>
      </div>
      
      {reminderTime && (
        <div className="reminder-time" title="Daily reminder">
          <FaClock className="icon" /> Reminder: {format(new Date(`1970-01-01T${reminderTime}`), 'hh:mm a')}
        </div>
      )}
      
      {lastCompleted && (
        <div className="last-completed" title="Last completed date and time">
          <FaRegCalendarCheck className="icon" />
          <span>Last: {format(lastCompleted, lastCompleted.getHours() !== 0 || lastCompleted.getMinutes() !== 0 ? 'MMM d, yyyy, hh:mm a' : 'MMM d, yyyy')}</span>
        </div>
      )}
      
      <div className="habit-actions">
        <button 
          className={`btn ${isCompletedToday ? 'btn-success' : 'btn-primary'}`}
          onClick={() => onToggleComplete(id)}
          title={isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
        >
          <FaCheck /> {isCompletedToday ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
