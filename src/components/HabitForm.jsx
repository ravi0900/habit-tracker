import React, { useState, useContext } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const HabitForm = ({ onSubmit, onCancel }) => {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    category: 'Health & Fitness',
    reminderTime: '',
  });

  const categories = [
    'Health & Fitness',
    'Work & Productivity',
    'Learning',
    'Mental Wellbeing',
    'Relationships',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={`habit-form ${darkMode ? 'dark' : ''}`}>
      <h2>Add New Habit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Habit Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Morning Exercise"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your habit..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency*</label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category*</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reminderTime">Reminder Time</label>
          <input
            type="time"
            id="reminderTime"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <FaTimes /> Cancel
          </button>
          <button type="submit" className="btn">
            <FaSave /> Save Habit
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
