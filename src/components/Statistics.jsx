import React from 'react';
import { generateWeeklyReport, calculateCategoryStats } from '../utils/analytics';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = ({ habits }) => {
  const weeklyReport = generateWeeklyReport(habits);
  const categoryStats = calculateCategoryStats(habits);

  const chartData = {
    labels: weeklyReport.completionsByDay.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
    ),
    datasets: [{
      label: 'Daily Completions',
      data: weeklyReport.completionsByDay.map(day => day.completions),
      backgroundColor: 'rgba(68, 102, 238, 0.5)',
      borderColor: 'rgba(68, 102, 238, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Habit Completion'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="statistics-container">
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Active Habits</h3>
          <p className="stat-value">{weeklyReport.activeHabits}</p>
        </div>
        <div className="stat-card">
          <h3>Total Completions</h3>
          <p className="stat-value">{weeklyReport.totalCompletions}</p>
        </div>
        <div className="stat-card">
          <h3>Average Streak</h3>
          <p className="stat-value">{weeklyReport.averageStreak} days</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="category-stats">
        <h3>Category Performance</h3>
        <div className="category-grid">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="category-card">
              <h4>{category}</h4>
              <p>Habits: {stats.count}</p>
              <p>Completions: {stats.completions}</p>
              <p>Avg Streak: {stats.averageStreak} days</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
