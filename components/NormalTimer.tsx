import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { TimerDisplay } from './TimerDisplay';

const DEFAULT_TIME_MS = 4 * 60 * 1000; // 4 minutes

export const NormalTimer: React.FC = () => {
  const [duration, setDuration] = useState(DEFAULT_TIME_MS);
  const [remaining, setRemaining] = useState(DEFAULT_TIME_MS);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleStartPause = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setRemaining(duration);
  }, [duration]);

  const adjustTime = (mins: number) => {
    const newTime = mins * 60 * 1000;
    setDuration(newTime);
    setRemaining(newTime);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && remaining > 0) {
      timerRef.current = window.setInterval(() => {
        setRemaining(prev => {
          if (prev <= 100) {
            setIsRunning(false);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, remaining]);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 h-full w-full py-8">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-slate-400 text-xl font-medium uppercase tracking-widest">Current Speaker</h2>
        <TimerDisplay milliseconds={remaining} isLowTime={remaining < 30000 && remaining > 0} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={handleReset}
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <Button 
          variant={isRunning ? "danger" : "primary"} 
          size="lg" 
          className="w-32 h-20 rounded-2xl"
          onClick={handleStartPause}
        >
          {isRunning ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
        </Button>
      </div>

      {/* Settings */}
      <div className="flex gap-2 mt-8 bg-slate-800/50 p-2 rounded-xl">
        {[3, 4, 5, 7, 10].map(min => (
          <button
            key={min}
            onClick={() => adjustTime(min)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              duration === min * 60 * 1000 
                ? 'bg-brand-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {min}m
          </button>
        ))}
      </div>
    </div>
  );
};