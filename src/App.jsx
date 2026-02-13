import { useState, useEffect, useRef } from 'react';
import { TimerProvider, useTimer, SESSION_TYPES, TIMER_STATES } from './context/TimerContext';
import Header from './components/Header';
import SessionTabs from './components/SessionTabs';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import SessionCounter from './components/SessionCounter';
import Settings from './components/Settings';
import { useSoundNotification } from './hooks/useSoundNotification';
import './App.css';

// Background colors for different session types
const SESSION_BACKGROUNDS = {
  [SESSION_TYPES.WORK]: 'bg-work-background',
  [SESSION_TYPES.SHORT_BREAK]: 'bg-shortBreak-background',
  [SESSION_TYPES.LONG_BREAK]: 'bg-longBreak-background',
};

// Main timer content component
function TimerContent() {
  const { sessionType, timerState, timeRemaining } = useTimer();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { playNotification, initAudioContext } = useSoundNotification();
  const prevTimeRef = useRef(timeRemaining);
  const hasPlayedRef = useRef(false);

  // Initialize audio context on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initAudioContext]);

  // Play sound when session ends
  useEffect(() => {
    // Check if timer just reached 0
    if (
      prevTimeRef.current > 0 &&
      timeRemaining === 0 &&
      timerState === TIMER_STATES.RUNNING &&
      !hasPlayedRef.current
    ) {
      playNotification();
      hasPlayedRef.current = true;
    }

    // Reset the flag when timer is reset or starts new session
    if (timeRemaining > 0 && prevTimeRef.current === 0) {
      hasPlayedRef.current = false;
    }

    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, timerState, playNotification]);

  // Update document title with timer
  useEffect(() => {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getSessionLabel = () => {
      switch (sessionType) {
        case SESSION_TYPES.WORK:
          return 'Work';
        case SESSION_TYPES.SHORT_BREAK:
          return 'Short Break';
        case SESSION_TYPES.LONG_BREAK:
          return 'Long Break';
        default:
          return 'Pomodoro';
      }
    };

    document.title = `${formatTime(timeRemaining)} - ${getSessionLabel()} | Pomodoro Timer`;

    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [timeRemaining, sessionType]);

  return (
    <div
      className={`min-h-screen ${SESSION_BACKGROUNDS[sessionType]} transition-colors duration-500`}
    >
      <Header onSettingsClick={() => setSettingsOpen(true)} />

      <main className="flex flex-col items-center justify-center px-4 py-8 md:py-12">
        {/* Session Type Tabs */}
        <SessionTabs />

        {/* Timer Display */}
        <div className="mt-8 md:mt-12" id="timer-panel" role="tabpanel">
          <TimerDisplay />
        </div>

        {/* Timer Controls */}
        <TimerControls />

        {/* Session Counter */}
        <SessionCounter />
      </main>

      {/* Settings Modal */}
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-white/50 text-sm">
        <p>
          Stay focused and productive with the Pomodoro Technique
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <TimerProvider>
      <TimerContent />
    </TimerProvider>
  );
}

export default App;
