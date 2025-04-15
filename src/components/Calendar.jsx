import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday } from 'date-fns';

const Calendar = ({ habits }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habits.filter(habit => 
      habit.completionHistory?.some(completion => 
        completion.date.split('T')[0] === dateStr
      )
    );
  };

  const getDayClass = (date, completions) => {
    let classes = 'calendar-day';
    if (isToday(date)) classes += ' today';
    if (completions.length > 0) {
      classes += ' has-completions';
      if (completions.length === habits.length) {
        classes += ' all-completed';
      }
    }
    return classes;
  };

  return (
    <div className="calendar-container">
      <h2>{format(today, 'MMMM yyyy')}</h2>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-header">{day}</div>
        ))}
        {days.map(day => {
          const completions = getCompletionsForDay(day);
          return (
            <div 
              key={day.toString()} 
              className={getDayClass(day, completions)}
              title={`${completions.length} habits completed`}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {completions.length > 0 && (
                <span className="completion-count">
                  {completions.length}/{habits.length}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
