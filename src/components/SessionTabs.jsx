import { useTimer, SESSION_TYPES, TIMER_STATES } from '../context/TimerContext';

export default function SessionTabs() {
  const { sessionType, timerState, switchSession } = useTimer();
  const isTimerActive = timerState !== TIMER_STATES.IDLE;

  const tabs = [
    { type: SESSION_TYPES.WORK, label: 'Work' },
    { type: SESSION_TYPES.SHORT_BREAK, label: 'Short Break' },
    { type: SESSION_TYPES.LONG_BREAK, label: 'Long Break' },
  ];

  const handleTabClick = (type) => {
    if (!isTimerActive && type !== sessionType) {
      switchSession(type);
    }
  };

  return (
    <div 
      className="flex flex-wrap justify-center gap-2 md:gap-4"
      role="tablist"
      aria-label="Session types"
    >
      {tabs.map((tab) => (
        <button
          key={tab.type}
          onClick={() => handleTabClick(tab.type)}
          disabled={isTimerActive}
          className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-medium
                     transition-all duration-200
                     ${sessionType === tab.type
                       ? 'bg-white/25 text-white shadow-lg'
                       : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                     }
                     ${isTimerActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                     focus:outline-none focus:ring-2 focus:ring-white/50`}
          role="tab"
          aria-selected={sessionType === tab.type}
          aria-controls="timer-panel"
          tabIndex={sessionType === tab.type ? 0 : -1}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
