import React from 'react';
import { FaFire, FaTrash, FaCheck } from 'react-icons/fa';
import { format } from 'date-fns';

const HabitCard = ({ habit, onDelete, onComplete }) => {
  const { id, name, description, streak, completedToday, reminderTime, lastCompleted } = habit;

  return (
    <div className="habit-card">
      <button 
        className="delete-btn" 
        onClick={() => onDelete(id)}
        aria-label="Delete habit"
      >
        <FaTrash />
      </button>
      
      <h3>{name}</h3>
      {description && <p>{description}</p>}
      
      <div className="streak-badge">
        <FaFire /> {streak} day streak
      </div>
      
      <div className="reminder-settings">
        <h4>Reminder</h4>
        <p>Time: {reminderTime}</p>
        {lastCompleted && (
          <p>Last completed: {format(new Date(lastCompleted), 'MMM d, yyyy')}</p>
        )}
      </div>
      
      <div className="habit-actions">
        <button 
          className={`btn ${completedToday ? 'btn-success' : ''}`}
          onClick={() => onComplete(id)}
          disabled={completedToday}
        >
          <FaCheck /> {completedToday ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
