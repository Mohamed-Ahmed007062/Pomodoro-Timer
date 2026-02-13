import { useState, useEffect } from 'react';
import { useTimer, TIMER_STATES } from '../context/TimerContext';

export default function Settings({ isOpen, onClose }) {
  const { config, updateConfig, timerState } = useTimer();
  const [localConfig, setLocalConfig] = useState(config);
  const isTimerActive = timerState !== TIMER_STATES.IDLE;

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  const handleChange = (key, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setLocalConfig((prev) => ({
        ...prev,
        [key]: numValue,
      }));
    }
  };

  const handleSave = () => {
    updateConfig(localConfig);
    onClose();
  };

  const handleReset = () => {
    const defaultConfig = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
    };
    setLocalConfig(defaultConfig);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">
        <h2 
          id="settings-title"
          className="text-2xl font-bold text-gray-800 mb-6"
        >
          Settings
        </h2>

        {isTimerActive && (
          <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded-lg text-sm">
            Settings cannot be saved while timer is active. Please pause or reset the timer first.
          </div>
        )}

        <div className="space-y-4">
          {/* Work Duration */}
          <div>
            <label 
              htmlFor="workDuration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Work Duration (minutes)
            </label>
            <input
              type="number"
              id="workDuration"
              min="1"
              max="120"
              value={localConfig.workDuration}
              onChange={(e) => handleChange('workDuration', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isTimerActive}
            />
          </div>

          {/* Short Break Duration */}
          <div>
            <label 
              htmlFor="shortBreakDuration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              id="shortBreakDuration"
              min="1"
              max="30"
              value={localConfig.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isTimerActive}
            />
          </div>

          {/* Long Break Duration */}
          <div>
            <label 
              htmlFor="longBreakDuration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              id="longBreakDuration"
              min="1"
              max="60"
              value={localConfig.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isTimerActive}
            />
          </div>

          {/* Sessions Before Long Break */}
          <div>
            <label 
              htmlFor="sessionsBeforeLongBreak"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sessions Before Long Break
            </label>
            <input
              type="number"
              id="sessionsBeforeLongBreak"
              min="1"
              max="10"
              value={localConfig.sessionsBeforeLongBreak}
              onChange={(e) => handleChange('sessionsBeforeLongBreak', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isTimerActive}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg 
                       hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400
                       transition-colors duration-200"
            disabled={isTimerActive}
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isTimerActive}
          >
            Save
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full"
          aria-label="Close settings"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
