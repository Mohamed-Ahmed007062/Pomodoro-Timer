import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const TimerContext = createContext(null);

// Default configuration
const DEFAULT_CONFIG = {
  workDuration: 25, // minutes
  shortBreakDuration: 5, // minutes
  longBreakDuration: 15, // minutes
  sessionsBeforeLongBreak: 4,
};

// Session types
export const SESSION_TYPES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

// Timer states
export const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
};

// Initial state
const initialState = {
  timerState: TIMER_STATES.IDLE,
  sessionType: SESSION_TYPES.WORK,
  timeRemaining: DEFAULT_CONFIG.workDuration * 60, // in seconds
  completedSessions: 0,
  totalCompletedSessions: 0,
  config: DEFAULT_CONFIG,
};

// Action types
const ACTIONS = {
  START: 'START',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  RESET: 'RESET',
  TICK: 'TICK',
  SESSION_COMPLETE: 'SESSION_COMPLETE',
  SWITCH_SESSION: 'SWITCH_SESSION',
  UPDATE_CONFIG: 'UPDATE_CONFIG',
};

// Helper function to get next session type
const getNextSessionType = (currentType, completedSessions, config) => {
  if (currentType === SESSION_TYPES.WORK) {
    // After work session, check if it's time for a long break
    if ((completedSessions + 1) % config.sessionsBeforeLongBreak === 0) {
      return SESSION_TYPES.LONG_BREAK;
    }
    return SESSION_TYPES.SHORT_BREAK;
  }
  // After any break, return to work
  return SESSION_TYPES.WORK;
};

// Helper function to get duration for session type
const getDurationForType = (type, config) => {
  switch (type) {
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

// Reducer function
function timerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START:
      return {
        ...state,
        timerState: TIMER_STATES.RUNNING,
      };

    case ACTIONS.PAUSE:
      return {
        ...state,
        timerState: TIMER_STATES.PAUSED,
      };

    case ACTIONS.RESUME:
      return {
        ...state,
        timerState: TIMER_STATES.RUNNING,
      };

    case ACTIONS.RESET:
      return {
        ...state,
        timerState: TIMER_STATES.IDLE,
        timeRemaining: getDurationForType(state.sessionType, state.config),
      };

    case ACTIONS.TICK:
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      };

    case ACTIONS.SESSION_COMPLETE: {
      const newCompletedSessions =
        state.sessionType === SESSION_TYPES.WORK
          ? state.completedSessions + 1
          : state.completedSessions;
      const newTotalCompletedSessions =
        state.sessionType === SESSION_TYPES.WORK
          ? state.totalCompletedSessions + 1
          : state.totalCompletedSessions;
      const nextType = getNextSessionType(
        state.sessionType,
        state.completedSessions,
        state.config
      );

      return {
        ...state,
        timerState: TIMER_STATES.IDLE,
        sessionType: nextType,
        timeRemaining: getDurationForType(nextType, state.config),
        completedSessions: newCompletedSessions,
        totalCompletedSessions: newTotalCompletedSessions,
      };
    }

    case ACTIONS.SWITCH_SESSION:
      return {
        ...state,
        timerState: TIMER_STATES.IDLE,
        sessionType: action.payload,
        timeRemaining: getDurationForType(action.payload, state.config),
      };

    case ACTIONS.UPDATE_CONFIG: {
      const newConfig = { ...state.config, ...action.payload };
      return {
        ...state,
        config: newConfig,
        timeRemaining: getDurationForType(state.sessionType, newConfig),
      };
    }

    default:
      return state;
  }
}

// Provider component
export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState, (initial) => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('pomodoroConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        const config = { ...initial.config, ...parsedConfig };
        return {
          ...initial,
          config,
          timeRemaining: config.workDuration * 60,
        };
      } catch {
        return initial;
      }
    }
    return initial;
  });

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pomodoroConfig', JSON.stringify(state.config));
  }, [state.config]);

  // Timer interval
  useEffect(() => {
    let interval = null;

    if (state.timerState === TIMER_STATES.RUNNING && state.timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: ACTIONS.TICK });
      }, 1000);
    } else if (state.timeRemaining === 0 && state.timerState === TIMER_STATES.RUNNING) {
      dispatch({ type: ACTIONS.SESSION_COMPLETE });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.timerState, state.timeRemaining]);

  // Action creators
  const start = useCallback(() => dispatch({ type: ACTIONS.START }), []);
  const pause = useCallback(() => dispatch({ type: ACTIONS.PAUSE }), []);
  const resume = useCallback(() => dispatch({ type: ACTIONS.RESUME }), []);
  const reset = useCallback(() => dispatch({ type: ACTIONS.RESET }), []);
  const switchSession = useCallback((type) => dispatch({ type: ACTIONS.SWITCH_SESSION, payload: type }), []);
  const updateConfig = useCallback((config) => dispatch({ type: ACTIONS.UPDATE_CONFIG, payload: config }), []);

  const value = {
    ...state,
    start,
    pause,
    resume,
    reset,
    switchSession,
    updateConfig,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

// Custom hook to use timer context
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
