
import React, { useState } from 'react';
import { TimerMode, Round } from './types';
import { NormalTimer } from './components/NormalTimer';
import { ChessTimer } from './components/ChessTimer';
import { RoundManager } from './components/RoundManager';
import { Timer, Users, Mic2, List, ChevronRight, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'TIMER' | 'FLOW'>('TIMER');
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.STANDARD);
  
  // Flow State
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isFlowMode, setIsFlowMode] = useState(false);
  
  // Branding / Settings State
  const [competitionName, setCompetitionName] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const currentRound = rounds[currentRoundIndex];

  const handleStartDebate = () => {
    if (rounds.length > 0) {
      setCurrentRoundIndex(0);
      setIsFlowMode(true);
      setCurrentTab('TIMER');
    }
  };

  const nextRound = () => {
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
    }
  };

  const prevRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-500">
            <Mic2 className="w-6 h-6" />
            <h1 className="font-bold text-xl tracking-tight text-white">辩论Timer</h1>
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
              <Timer className="w-4 h-4" /> 计时器
            </button>
            <button
              onClick={() => setCurrentTab('FLOW')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'FLOW' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" /> 流程
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {currentTab === 'TIMER' ? (
          <div className="flex-1 flex flex-col relative">
            
            {/* Background Layer */}
            {backgroundImage && (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-700"
                  style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-slate-950/80 z-0 backdrop-blur-[2px]" />
              </>
            )}

            <div className="relative z-10 flex-1 flex flex-col">
              {/* Competition Header */}
              {competitionName && (
                <div className="w-full text-center py-3 bg-slate-900/40 border-b border-white/5 backdrop-blur-sm">
                  <h2 className="text-lg md:text-xl font-bold text-brand-100 tracking-[0.2em] uppercase shadow-sm drop-shadow-md">
                    {competitionName}
                  </h2>
                </div>
              )}

              {/* Mode Switcher OR Flow Control Bar */}
              {isFlowMode && rounds.length > 0 ? (
                <div className="bg-slate-900/80 border-b border-slate-800/50 p-3 flex items-center justify-between px-6 shadow-lg backdrop-blur-md">
                  <button 
                    onClick={prevRound} 
                    disabled={currentRoundIndex === 0}
                    className="flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> 上一环节
                  </button>

                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-1">
                      第 {currentRoundIndex + 1} / {rounds.length} 环节
                    </div>
                    <div className="text-white font-bold flex items-center gap-2 justify-center text-lg shadow-black drop-shadow-md">
                      {currentRound.title}
                    </div>
                  </div>

                  <button 
                    onClick={nextRound} 
                    disabled={currentRoundIndex === rounds.length - 1}
                    className="flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    下一环节 <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center pt-6 pb-2">
                  <div className="bg-slate-900/80 p-1 rounded-xl inline-flex border border-slate-800 backdrop-blur-sm shadow-xl">
                    <button 
                      onClick={() => setTimerMode(TimerMode.STANDARD)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        timerMode === TimerMode.STANDARD 
                        ? 'bg-brand-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      普通模式
                    </button>
                    <button 
                      onClick={() => setTimerMode(TimerMode.CHESS)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        timerMode === TimerMode.CHESS 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Users className="w-4 h-4" /> 自由辩论
                    </button>
                  </div>
                </div>
              )}

              {/* Timer Component Render */}
              <div className="flex-1 flex relative">
                {isFlowMode && currentRound ? (
                  currentRound.type === 'NORMAL' ? (
                    <NormalTimer 
                      key={currentRound.id} 
                      initialDuration={currentRound.durationMinutes}
                      speakerLabel={currentRound.speaker === 'A' ? '正方' : '反方'}
                    />
                  ) : (
                    <ChessTimer 
                      key={currentRound.id}
                      initialTime={currentRound.durationMinutes}
                    />
                  )
                ) : (
                  timerMode === TimerMode.STANDARD ? <NormalTimer /> : <ChessTimer />
                )}
              </div>
            </div>
          </div>
        ) : (
          <RoundManager 
            rounds={rounds} 
            setRounds={setRounds} 
            onStartDebate={handleStartDebate}
            competitionName={competitionName}
            setCompetitionName={setCompetitionName}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
          />
        )}
      </main>
    </div>
  );
};

export default App;
