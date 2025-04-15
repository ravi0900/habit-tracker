import React from 'react';
import { FaFire } from 'react-icons/fa';
import SocialShare from './SocialShare';

const StreakVisualization = ({ streak, bestStreak }) => {
  return (
    <div className="streak-container">
      <div className="streak-display">
        <FaFire className="fire-icon" />
        <span className="streak-count">{streak}</span>
        <span className="streak-label">day streak</span>
      </div>
      {bestStreak > streak && (
        <div className="best-streak">
          Best: {bestStreak} days
        </div>
      )}
      {streak > 3 && <SocialShare streak={streak} />}
    </div>
  );
};

export default StreakVisualization;
