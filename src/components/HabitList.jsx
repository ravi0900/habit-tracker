import React from 'react';
import HabitCard from './HabitCard.jsx';

export default function HabitList({ habits, onDelete, onComplete }) {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <h2>No habits yet</h2>
        <p>Add your first habit to start tracking your progress!</p>
      </div>
    );
  }

  return (
    <div className="habits-container dark-mode">
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}
