import { useEffect, useRef, useCallback } from 'react';

// Create audio context for generating sounds
const createBeepSound = (audioContext, frequency, duration, type = 'sine') => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  // Envelope for smoother sound
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
  gainNode.gain.linearRampToValueAtTime(0.3, now + duration - 0.05);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration);

  return oscillator;
};

// Play notification sound pattern
const playNotificationPattern = (audioContext) => {
  const now = audioContext.currentTime;
  
  // Play a pleasant chime pattern
  const notes = [
    { freq: 523.25, delay: 0 },     // C5
    { freq: 659.25, delay: 0.15 },  // E5
    { freq: 783.99, delay: 0.3 },   // G5
    { freq: 1046.50, delay: 0.45 }, // C6
  ];

  notes.forEach(({ freq, delay }) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    const startTime = now + delay;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, startTime + 0.3);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
};

export function useSoundNotification() {
  const audioContextRef = useRef(null);

  // Initialize audio context on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Play notification sound
  const playNotification = useCallback(() => {
    try {
      const audioContext = initAudioContext();
      playNotificationPattern(audioContext);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, [initAudioContext]);

  // Play tick sound (optional, for each second)
  const playTick = useCallback(() => {
    try {
      const audioContext = initAudioContext();
      createBeepSound(audioContext, 800, 0.05, 'sine');
    } catch (error) {
      // Silently fail for tick sounds
    }
  }, [initAudioContext]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { playNotification, playTick, initAudioContext };
}
