import { useTimer, TIMER_STATES } from '../context/TimerContext';

export default function TimerControls() {
  const { timerState, start, pause, resume, reset } = useTimer();

  const handleMainButton = () => {
    switch (timerState) {
      case TIMER_STATES.IDLE:
        start();
        break;
      case TIMER_STATES.RUNNING:
        pause();
        break;
      case TIMER_STATES.PAUSED:
        resume();
        break;
      default:
        start();
    }
  };

  const getMainButtonLabel = () => {
    switch (timerState) {
      case TIMER_STATES.IDLE:
        return 'Start';
      case TIMER_STATES.RUNNING:
        return 'Pause';
      case TIMER_STATES.PAUSED:
        return 'Resume';
      default:
        return 'Start';
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Main Control Button */}
      <button
        onClick={handleMainButton}
        className="px-8 py-3 text-xl font-semibold text-gray-800 bg-white rounded-full 
                   hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/50
                   transition-all duration-200 transform hover:scale-105 active:scale-95
                   min-w-[140px]"
        aria-label={getMainButtonLabel()}
      >
        {getMainButtonLabel()}
      </button>

      {/* Reset Button */}
      {(timerState === TIMER_STATES.PAUSED || timerState === TIMER_STATES.RUNNING) && (
        <button
          onClick={reset}
          className="p-3 text-white bg-white/20 rounded-full 
                     hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/50
                     transition-all duration-200"
          aria-label="Reset timer"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}
