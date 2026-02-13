import { useTimer, SESSION_TYPES } from '../context/TimerContext';

export default function TimerDisplay() {
  const { timeRemaining, sessionType, timerState, config } = useTimer();

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getTotalTime = () => {
    switch (sessionType) {
      case SESSION_TYPES.WORK:
        return config.workDuration * 60;
      case SESSION_TYPES.SHORT_BREAK:
        return config.shortBreakDuration * 60;
      case SESSION_TYPES.LONG_BREAK:
        return config.longBreakDuration * 60;
      default:
        return config.workDuration * 60;
    }
  };

  const progress = (timeRemaining / getTotalTime()) * 100;
  const circumference = 2 * Math.PI * 45; // radius is 45% of the circle
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Get session type label
  const getSessionLabel = () => {
    switch (sessionType) {
      case SESSION_TYPES.WORK:
        return 'Work Session';
      case SESSION_TYPES.SHORT_BREAK:
        return 'Short Break';
      case SESSION_TYPES.LONG_BREAK:
        return 'Long Break';
      default:
        return 'Work Session';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Session Type Label */}
      <h2 
        className="text-xl md:text-2xl font-semibold text-white/90 mb-6"
        aria-live="polite"
      >
        {getSessionLabel()}
      </h2>

      {/* Timer Circle */}
      <div 
        className={`relative w-48 h-48 md:w-64 md:h-64 ${timerState === 'running' ? 'timer-active' : ''}`}
        role="timer"
        aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
      >
        <svg 
          className="w-full h-full transform -rotate-90" 
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-5xl md:text-7xl font-bold text-white tabular-nums"
            aria-hidden="true"
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Screen reader only time announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {formatTime(timeRemaining)} remaining
      </div>
    </div>
  );
}
