import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export default function ProgressDashboard({ habits }) {
  // Calculate weekly completion rate
  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  });
  
  const weeklyCompletion = habits.reduce((acc, habit) => {
    return acc + (habit.completedToday ? 1 : 0);
  }, 0) / habits.length || 0;

  return (
    <div className="dashboard">
      <h3>Weekly Progress</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${weeklyCompletion * 100}%` }}
        ></div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Current Streak</h4>
          <p>{Math.max(...habits.map(h => h.streak), 0)} days</p>
        </div>
        <div className="stat-card">
          <h4>Habits Tracked</h4>
          <p>{habits.length}</p>
        </div>
      </div>
    </div>
  );
}
