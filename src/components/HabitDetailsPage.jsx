import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import HabitCard from "./HabitCard";
import NotFound from "./NotFound";
import { format } from "date-fns";

const HabitDetailsPage = ({ habits, onToggleComplete, onDelete }) => {
  const { id } = useParams();
  const habit = habits.find(h => h.id === id);
  const navigate = useNavigate();

  if (!habit) return <NotFound />;

  return (
    <div className="habit-details-page" style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <button className="btn" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <HabitCard habit={habit} onToggleComplete={onToggleComplete} onDelete={onDelete} />
      <h2 style={{ marginTop: 32 }}>Completion History</h2>
      {habit.completionHistory.length === 0 ? (
        <p>No completions yet.</p>
      ) : (
        <table className="completion-history" style={{ width: "100%", marginTop: 16 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {habit.completionHistory.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.date}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* More stats, streaks, editing, notes, or charts can go here */}
    </div>
  );
};

export default HabitDetailsPage;
