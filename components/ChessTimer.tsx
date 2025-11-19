import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Play, RotateCcw, User } from 'lucide-react';
import { Button } from './Button';
import { TimerDisplay } from './TimerDisplay';
import { SpeakerState } from '../types';

const DEFAULT_TIME_MS = 5 * 60 * 1000; // 5 minutes per side

export const ChessTimer: React.FC = () => {
  const [timeA, setTimeA] = useState(DEFAULT_TIME_MS);
  const [timeB, setTimeB] = useState(DEFAULT_TIME_MS);
  const [activeSpeaker, setActiveSpeaker] = useState<SpeakerState>(SpeakerState.IDLE);
  const [pausedState, setPausedState] = useState<SpeakerState>(SpeakerState.IDLE); // To remember who was active before pause
  
  const timerRef = useRef<number | null>(null);

  // If we are paused (IDLE), but we have a remembered state, it means we are "Paused in game".
  // If pausedState is IDLE, it means we are fully reset/stopped.
  const isPaused = activeSpeaker === SpeakerState.IDLE && pausedState !== SpeakerState.IDLE;

  const toggleTimer = (speaker: 'A' | 'B') => {
    if (activeSpeaker === SpeakerState.IDLE) {
      // Start or Resume
      if (pausedState !== SpeakerState.IDLE) {
        // Resume
        setActiveSpeaker(pausedState);
      } else {
        // Start fresh (usually Speaker A starts first in debates, or whoever is clicked)
        setActiveSpeaker(speaker === 'A' ? SpeakerState.SPEAKER_A : SpeakerState.SPEAKER_B);
      }
    } else {
      // Switch turns
      if ((speaker === 'A' && activeSpeaker === SpeakerState.SPEAKER_A) ||
          (speaker === 'B' && activeSpeaker === SpeakerState.SPEAKER_B)) {
        // If current speaker clicks their own button, their time stops, other starts
         setActiveSpeaker(speaker === 'A' ? SpeakerState.SPEAKER_B : SpeakerState.SPEAKER_A);
      }
    }
  };

  // Global Pause/Resume for the moderator
  const handleGlobalPause = () => {
    if (activeSpeaker !== SpeakerState.IDLE) {
      setPausedState(activeSpeaker);
      setActiveSpeaker(SpeakerState.IDLE);
    } else if (pausedState !== SpeakerState.IDLE) {
      setActiveSpeaker(pausedState);
    }
  };

  const handleReset = () => {
    setActiveSpeaker(SpeakerState.IDLE);
    setPausedState(SpeakerState.IDLE);
    setTimeA(DEFAULT_TIME_MS);
    setTimeB(DEFAULT_TIME_MS);
  };

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (activeSpeaker !== SpeakerState.IDLE) {
      timerRef.current = window.setInterval(() => {
        if (activeSpeaker === SpeakerState.SPEAKER_A) {
          setTimeA(prev => Math.max(0, prev - 100));
        } else {
          setTimeB(prev => Math.max(0, prev - 100));
        }
      }, 100);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSpeaker]);

  // Determine visual states
  const isAActive = activeSpeaker === SpeakerState.SPEAKER_A;
  const isBActive = activeSpeaker === SpeakerState.SPEAKER_B;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col md:flex-row w-full h-full gap-4 p-4">
        
        {/* Speaker A Area */}
        <div 
          onClick={() => activeSpeaker !== SpeakerState.IDLE && toggleTimer('A')}
          className={`flex-1 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden border-4 ${
            isAActive 
              ? 'bg-brand-600 border-brand-400 shadow-[0_0_40px_rgba(2,132,199,0.5)]' 
              : 'bg-slate-800 border-slate-700 opacity-60 hover:opacity-80'
          }`}
        >
           <div className="absolute top-6 left-6 flex items-center gap-2">
             <User className="w-6 h-6" />
             <span className="font-bold tracking-wider">PROPOSITION (A)</span>
           </div>
           <TimerDisplay milliseconds={timeA} size="xl" isLowTime={timeA < 30000} />
           <p className="mt-4 text-sm uppercase tracking-widest opacity-75">
             {isAActive ? 'Running...' : 'Tap to End Turn'}
           </p>
        </div>

        {/* Speaker B Area */}
        <div 
          onClick={() => activeSpeaker !== SpeakerState.IDLE && toggleTimer('B')}
          className={`flex-1 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden border-4 ${
            isBActive 
              ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_40px_rgba(5,150,105,0.5)]' 
              : 'bg-slate-800 border-slate-700 opacity-60 hover:opacity-80'
          }`}
        >
           <div className="absolute top-6 right-6 flex items-center gap-2">
             <span className="font-bold tracking-wider">OPPOSITION (B)</span>
             <User className="w-6 h-6" />
           </div>
           <TimerDisplay milliseconds={timeB} size="xl" isLowTime={timeB < 30000} />
           <p className="mt-4 text-sm uppercase tracking-widest opacity-75">
             {isBActive ? 'Running...' : 'Tap to End Turn'}
           </p>
        </div>
      </div>

      {/* Central Controls */}
      <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6 px-4">
        
        <Button variant="secondary" onClick={handleReset}>
          <RotateCcw className="w-5 h-5 mr-2" /> Reset
        </Button>

        {activeSpeaker === SpeakerState.IDLE && pausedState === SpeakerState.IDLE ? (
           <Button variant="primary" size="lg" onClick={() => toggleTimer('A')} className="w-48">
             Start Debate
           </Button>
        ) : (
          <Button 
            variant={activeSpeaker === SpeakerState.IDLE ? "primary" : "danger"} 
            size="lg" 
            onClick={handleGlobalPause}
            className="w-48"
          >
            {activeSpeaker === SpeakerState.IDLE ? (
              <><Play className="w-5 h-5 mr-2" /> Resume</>
            ) : (
              <><Pause className="w-5 h-5 mr-2" /> Pause</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};