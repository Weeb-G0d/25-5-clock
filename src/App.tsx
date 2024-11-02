import React, { useState, useEffect } from 'react';
import beepSound from './assets/beep.mp3';



const PomodoroClock: React.FC = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 0) {
          {const audio = document.getElementById('beep') as HTMLAudioElement;
            audio.play();
          }
          if (isSession) {
            setIsSession(false);
            return breakLength * 60;
          } else {
            setIsSession(true);
            return sessionLength * 60;
          }
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isSession, breakLength, sessionLength]);

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    const audio = document.getElementById('beep') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const incrementBreak = () => setBreakLength(prev => Math.min(prev + 1, 60));
  const decrementBreak = () => setBreakLength(prev => Math.max(prev - 1, 1));
  const incrementSession = () => {
    setSessionLength(prev => {
      const newSessionLength = Math.min(prev + 1, 60);
      if (!isRunning) setTimeLeft(newSessionLength * 60);
      return newSessionLength;
    });
  };
  
  const decrementSession = () => {
    setSessionLength(prev => {
      const newSessionLength = Math.max(prev - 1, 1);
      if (!isRunning) setTimeLeft(newSessionLength * 60);
      return newSessionLength;
    });
  };

  return (
    <div>
      <h1>Pomodoro Clock</h1>
      <div id="break-label">
        Break Length
        <button id="break-decrement" onClick={decrementBreak}>-</button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={incrementBreak}>+</button>
      </div>
      <div id="session-label">
        Session Length
        <button id="session-decrement" onClick={decrementSession}>-</button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" onClick={incrementSession}>+</button>
      </div>
      <div id="timer-label">
        {isSession ? 'Session' : 'Break'}
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>
      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={handleReset}>Reset</button>
      <audio id="beep" src={beepSound} preload="auto"></audio>
    </div>
  );
};

export default PomodoroClock;