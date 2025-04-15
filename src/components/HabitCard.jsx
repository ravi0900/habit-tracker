import React, { useContext } from 'react';
import { FaFire, FaTrash, FaCheck, FaClock, FaTag } from 'react-icons/fa';
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

  return (
    <div className={`habit-card ${darkMode ? 'dark' : ''}`}>
      <button 
        className="delete-btn" 
        onClick={() => onDelete(id)}
        aria-label="Delete habit"
      >
        <FaTrash />
      </button>
      
      <h3>{name}</h3>
      {description && <p className="description">{description}</p>}
      
      <div className="habit-info">
        <div className="info-item">
          <FaTag className="icon" />
          <span>{category}</span>
        </div>
        <div className="info-item">
          <FaClock className="icon" />
          <span>{frequency}</span>
        </div>
      </div>
      
      <div className="streak-badge">
        <FaFire className="icon" /> {streak} day streak
      </div>
      
      {reminderTime && (
        <div className="reminder-time">
          <FaClock className="icon" /> Reminder: {reminderTime}
        </div>
      )}
      
      {lastCompleted && (
        <div className="last-completed">
          Last completed: {format(lastCompleted, 'MMM d, yyyy')}
        </div>
      )}
      
      <div className="habit-actions">
        <button 
          className={`btn ${isCompletedToday ? 'btn-success' : ''}`}
          onClick={() => onToggleComplete(id)}
        >
          <FaCheck /> {isCompletedToday ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
