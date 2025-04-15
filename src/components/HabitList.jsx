import React, { useContext } from 'react';
import HabitCard from './HabitCard.jsx';
import { ThemeContext } from '../context/ThemeContext';

export default function HabitList({ habits, onDelete, onToggleComplete }) {
  const { darkMode } = useContext(ThemeContext);

  if (habits.length === 0) {
    return (
      <div className={`empty-state ${darkMode ? 'dark' : ''}`}>
        <h2>No habits yet</h2>
        <p>Add your first habit to start tracking your progress!</p>
      </div>
    );
  }

  return (
    <div className={`habits-container ${darkMode ? 'dark' : ''}`}>
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
