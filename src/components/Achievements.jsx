import React from 'react';
import { FaTrophy, FaMedal, FaStar, FaFire } from 'react-icons/fa';

const achievements = {
  streaks: [
    { days: 7, icon: <FaMedal />, name: 'Week Warrior', description: 'Maintain a 7-day streak' },
    { days: 30, icon: <FaTrophy />, name: 'Monthly Master', description: 'Maintain a 30-day streak' },
    { days: 100, icon: <FaStar />, name: 'Century Club', description: 'Maintain a 100-day streak' }
  ],
  completions: [
    { count: 10, icon: <FaMedal />, name: 'Getting Started', description: '10 total completions' },
    { count: 50, icon: <FaTrophy />, name: 'Habit Hero', description: '50 total completions' },
    { count: 100, icon: <FaStar />, name: 'Centurion', description: '100 total completions' }
  ],
  consistency: [
    { rate: 50, icon: <FaMedal />, name: 'Consistent', description: '50% completion rate' },
    { rate: 75, icon: <FaTrophy />, name: 'Dedicated', description: '75% completion rate' },
    { rate: 90, icon: <FaStar />, name: 'Elite', description: '90% completion rate' }
  ]
};

const Achievements = ({ habits }) => {
  const calculateAchievements = () => {
    const earned = {
      streaks: [],
      completions: [],
      consistency: []
    };

    // Calculate total completions across all habits
    const totalCompletions = habits.reduce((sum, habit) => 
      sum + (habit.completionHistory?.length || 0), 0
    );

    // Check streak achievements
    const maxStreak = Math.max(...habits.map(habit => habit.longestStreak || 0));
    achievements.streaks.forEach(achievement => {
      if (maxStreak >= achievement.days) {
        earned.streaks.push(achievement);
      }
    });

    // Check completion achievements
    achievements.completions.forEach(achievement => {
      if (totalCompletions >= achievement.count) {
        earned.completions.push(achievement);
      }
    });

    // Check consistency achievements
    const avgCompletionRate = habits.reduce((sum, habit) => {
      const rate = habit.completionHistory ? 
        (habit.completionHistory.length / habit.daysSinceCreation) * 100 : 0;
      return sum + rate;
    }, 0) / habits.length;

    achievements.consistency.forEach(achievement => {
      if (avgCompletionRate >= achievement.rate) {
        earned.consistency.push(achievement);
      }
    });

    return earned;
  };

  const earnedAchievements = calculateAchievements();

  return (
    <div className="achievements-container">
      <h2><FaTrophy /> Achievements</h2>
      
      <div className="achievements-grid">
        <div className="achievement-category">
          <h3><FaFire /> Streak Achievements</h3>
          <div className="achievement-list">
            {achievements.streaks.map(achievement => (
              <div 
                key={achievement.name}
                className={`achievement-card ${
                  earnedAchievements.streaks.includes(achievement) ? 'earned' : 'locked'
                }`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievement-category">
          <h3><FaMedal /> Completion Achievements</h3>
          <div className="achievement-list">
            {achievements.completions.map(achievement => (
              <div 
                key={achievement.name}
                className={`achievement-card ${
                  earnedAchievements.completions.includes(achievement) ? 'earned' : 'locked'
                }`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievement-category">
          <h3><FaStar /> Consistency Achievements</h3>
          <div className="achievement-list">
            {achievements.consistency.map(achievement => (
              <div 
                key={achievement.name}
                className={`achievement-card ${
                  earnedAchievements.consistency.includes(achievement) ? 'earned' : 'locked'
                }`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
