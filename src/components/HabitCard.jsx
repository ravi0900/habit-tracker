import React, { useContext } from 'react';
import { FaFireAlt } from 'react-icons/fa';
import { GiLaurelCrown } from 'react-icons/gi';
import { FaTrash, FaCheck, FaClock, FaTag, FaRegCalendarCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

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
  const today = new Date().toLocaleDateString('en-CA');
  const isCompletedToday = completedDates.some(entry => entry.date === today);

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < 366; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-CA');
      
      if (completedDates.some(entry => entry.date === dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();
  // Best streak
  const bestStreak = completedDates.length > 0 ? Math.max(...(() => {
    let best = 0, curr = 0, prev = null;
    completedDates
      .map(entry => entry.date)
      .sort()
      .forEach(dateStr => {
        if (!prev) { curr = 1; } 
        else {
          const prevDate = new Date(prev);
          const currDate = new Date(dateStr);
          prevDate.setDate(prevDate.getDate() + 1);
          if (prevDate.toLocaleDateString('en-CA') === currDate.toLocaleDateString('en-CA')) {
            curr++;
          } else {
            curr = 1;
          }
        }
        best = Math.max(best, curr);
        prev = dateStr;
      });
    return [best];
  })()) : 0;

  const lastCompleted = completedDates.length > 0 ? completedDates[completedDates.length - 1] : null;

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
      
      const dateStr = date.toLocaleDateString('en-CA');
      if (completedDates.some(entry => entry.date === dateStr)) {
        total++;
      }
    }
    
    const daysPassed = Math.min(now.getDate(), daysInMonth);
    return Math.round((total / daysPassed) * 100);
  };
  
  const completionPercentage = calculateMonthCompletion();

  return (
    <Link to={`/habit/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`habit-card ${darkMode ? 'dark' : ''} ${isCompletedToday ? 'completed-today' : ''}`}>
        <div className="habit-card-header">
          <h3>{name}</h3>
          <button 
            className="delete-btn" 
            onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(id); }}
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
            <div className="streak-badge" title={`Current streak: ${streak} days`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaFireAlt style={{
                fontSize: 38,
                color: streak >= 7 ? '#ff4500' : '#ff9800',
                filter: streak >= 21 ? 'drop-shadow(0 0 12px #ff9800)' : 'drop-shadow(0 0 5px #ff9800)',
                verticalAlign: 'middle',
                animation: streak >= 7 ? 'flame-flicker 1s infinite alternate' : 'none',
                transition: 'color 0.3s, filter 0.3s'
              }} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>{streak}</span>
              {streak >= 7 && (
                <span style={{ marginLeft: 4, fontSize: 18, color: '#ffd700', display: 'flex', alignItems: 'center' }}>
                  <GiLaurelCrown style={{ fontSize: 24, marginRight: 2, color: '#ffd700', filter: 'drop-shadow(0 0 6px #ffd700)' }} />
                  <span style={{ fontWeight: 600 }}>🔥</span>
                </span>
              )}
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
          {bestStreak > 0 && (
            <div className="best-streak" style={{ color: '#ffd700', fontWeight: 600, fontSize: 14, marginTop: 4 }}>
              <GiLaurelCrown style={{ fontSize: 18, marginRight: 2, verticalAlign: 'middle' }} />
              Best streak: {bestStreak} days
            </div>
          )}
        </div>
        
        {reminderTime && (
          <div className="reminder-time" title="Daily reminder">
            <FaClock className="icon" /> Reminder: {format(new Date(`1970-01-01T${reminderTime}`), 'hh:mm a')}
          </div>
        )}
        
        {lastCompleted && (
          <div className="last-completed" title="Last completed date and time">
            <FaRegCalendarCheck className="icon" />
            <span>
              Last: {format(new Date(lastCompleted.timestamp), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        )}
        
        <div className="habit-actions">
          <button 
            className={`btn ${isCompletedToday ? 'btn-success' : 'btn-primary'}`}
            onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleComplete(id); }}
            title={isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
          >
            <FaCheck /> {isCompletedToday ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HabitCard;
