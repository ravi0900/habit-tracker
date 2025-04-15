export const calculateHabitStats = (habit) => {
  const today = new Date();
  const completionRate = habit.completionHistory ? 
    (habit.completionHistory.length / habit.daysSinceCreation) * 100 : 0;

  return {
    streak: habit.streak || 0,
    completionRate: Math.round(completionRate),
    totalCompletions: habit.completionHistory?.length || 0,
    longestStreak: habit.longestStreak || 0,
  };
};

export const generateWeeklyReport = (habits) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return {
    completionsByDay: last7Days.map(date => ({
      date,
      completions: habits.filter(habit => 
        habit.completionHistory?.some(completion => 
          completion.date.split('T')[0] === date
        )
      ).length
    })),
    totalCompletions: habits.reduce((sum, habit) => 
      sum + (habit.completionHistory?.length || 0), 0
    ),
    activeHabits: habits.length,
    averageStreak: Math.round(
      habits.reduce((sum, habit) => sum + (habit.streak || 0), 0) / habits.length
    ) || 0
  };
};

export const calculateCategoryStats = (habits) => {
  const categories = {};
  habits.forEach(habit => {
    const category = habit.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = {
        count: 0,
        completions: 0,
        averageStreak: 0
      };
    }
    categories[category].count++;
    categories[category].completions += habit.completionHistory?.length || 0;
    categories[category].averageStreak += habit.streak || 0;
  });

  Object.keys(categories).forEach(category => {
    categories[category].averageStreak = Math.round(
      categories[category].averageStreak / categories[category].count
    );
  });

  return categories;
};
