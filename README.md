# Habit Tracker

A simple web application to track your daily habits, maintain streaks, and receive reminders.

## Features

- Create and manage habits
- Track daily completion of habits
- Maintain streaks for consistent habit completion
- Set daily reminders for each habit
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- Click "Add Habit" to create a new habit
- Fill in the habit details including name, description, frequency, and reminder time
- Click "Save Habit" to add the habit to your tracker
- Mark habits as complete each day to build your streak
- Receive browser notifications at your specified reminder times
- Habits automatically reset at midnight for the next day

## Technologies Used

- React.js
- Local Storage for data persistence
- Browser Notifications API
- date-fns for date handling
- UUID for unique identifiers

## License

This project is open source and available under the MIT License.
