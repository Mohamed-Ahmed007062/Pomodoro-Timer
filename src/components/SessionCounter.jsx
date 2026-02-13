import { useTimer } from '../context/TimerContext';

export default function SessionCounter() {
  const { completedSessions, totalCompletedSessions, config } = useTimer();
  const sessionsBeforeLongBreak = config.sessionsBeforeLongBreak;

  return (
    <div 
      className="mt-8 text-center"
      aria-label="Session progress"
    >
      {/* Current cycle progress */}
      <div className="flex justify-center gap-2 mb-3">
        {Array.from({ length: sessionsBeforeLongBreak }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < completedSessions % sessionsBeforeLongBreak
                ? 'bg-white'
                : 'bg-white/30'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Session count text */}
      <p className="text-white/80 text-sm md:text-base">
        <span className="font-semibold">{completedSessions % sessionsBeforeLongBreak}</span>
        {' / '}
        <span>{sessionsBeforeLongBreak}</span>
        <span className="ml-1">sessions until long break</span>
      </p>

      {/* Total completed sessions */}
      <p className="text-white/60 text-xs md:text-sm mt-2">
        Total completed: <span className="font-semibold">{totalCompletedSessions}</span> work sessions
      </p>
    </div>
  );
}
