import React, { useState } from 'react';
import { TimerMode } from './types';
import { NormalTimer } from './components/NormalTimer';
import { ChessTimer } from './components/ChessTimer';
import { Tools } from './components/Tools';
import { Timer, Users, Sparkles, Mic2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'TIMER' | 'TOOLS'>('TIMER');
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.STANDARD);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-500">
            <Mic2 className="w-6 h-6" />
            <h1 className="font-bold text-xl tracking-tight text-white">DebateMaster AI</h1>
          </div>

          <nav className="flex bg-slate-800/50 p-1 rounded-lg">
            <button
              onClick={() => setCurrentTab('TIMER')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'TIMER' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Timer className="w-4 h-4" /> Timer
            </button>
            <button
              onClick={() => setCurrentTab('TOOLS')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'TOOLS' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" /> AI Tools
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {currentTab === 'TIMER' ? (
          <div className="flex-1 flex flex-col">
            {/* Timer Mode Switcher */}
            <div className="flex justify-center pt-6 pb-2">
              <div className="bg-slate-900 p-1 rounded-xl inline-flex border border-slate-800">
                <button 
                  onClick={() => setTimerMode(TimerMode.STANDARD)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    timerMode === TimerMode.STANDARD 
                    ? 'bg-brand-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Normal Mode
                </button>
                <button 
                  onClick={() => setTimerMode(TimerMode.CHESS)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    timerMode === TimerMode.CHESS 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Users className="w-4 h-4" /> Back & Forth
                </button>
              </div>
            </div>

            {/* Timer Component Render */}
            <div className="flex-1 flex relative">
              {timerMode === TimerMode.STANDARD ? <NormalTimer /> : <ChessTimer />}
            </div>
          </div>
        ) : (
          <Tools />
        )}
      </main>
    </div>
  );
};

export default App;