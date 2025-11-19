import React, { useState } from 'react';
import { Round, RoundType } from '../types';
import { Button } from './Button';
import { Plus, Trash2, Play, MoveUp, MoveDown, Clock, Users } from 'lucide-react';

interface RoundManagerProps {
  rounds: Round[];
  setRounds: React.Dispatch<React.SetStateAction<Round[]>>;
  onStartDebate: () => void;
}

export const RoundManager: React.FC<RoundManagerProps> = ({ rounds, setRounds, onStartDebate }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(4);
  const [newType, setNewType] = useState<RoundType>('NORMAL');
  const [newSpeaker, setNewSpeaker] = useState<'A' | 'B'>('A');

  const addRound = () => {
    if (!newTitle) return;
    
    const round: Round = {
      id: Date.now().toString(),
      title: newTitle,
      type: newType,
      durationMinutes: newDuration,
      speaker: newType === 'NORMAL' ? newSpeaker : undefined
    };

    setRounds([...rounds, round]);
    setNewTitle('');
  };

  const removeRound = (id: string) => {
    setRounds(rounds.filter(r => r.id !== id));
  };

  const moveRound = (index: number, direction: 'up' | 'down') => {
    const newRounds = [...rounds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newRounds.length) {
      [newRounds[index], newRounds[targetIndex]] = [newRounds[targetIndex], newRounds[index]];
      setRounds(newRounds);
    }
  };

  const loadTemplate = () => {
    const template: Round[] = [
      { id: '1', title: 'Proposition Opening', type: 'NORMAL', durationMinutes: 4, speaker: 'A' },
      { id: '2', title: 'Opposition Opening', type: 'NORMAL', durationMinutes: 4, speaker: 'B' },
      { id: '3', title: 'Open Debate', type: 'CHESS', durationMinutes: 3 },
      { id: '4', title: 'Opposition Closing', type: 'NORMAL', durationMinutes: 3, speaker: 'B' },
      { id: '5', title: 'Proposition Closing', type: 'NORMAL', durationMinutes: 3, speaker: 'A' },
    ];
    setRounds(template);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-white">Debate Flow</h2>
          <p className="text-slate-400">Configure the sequence of rounds for your debate.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadTemplate}>Load Standard</Button>
          <Button 
            variant="primary" 
            onClick={onStartDebate}
            disabled={rounds.length === 0}
            className="bg-brand-600 hover:bg-brand-500"
          >
            <Play className="w-4 h-4 mr-2" /> Start Sequence
          </Button>
        </div>
      </div>

      {/* List of Rounds */}
      <div className="space-y-3">
        {rounds.map((round, index) => (
          <div key={round.id} className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
            <div className="flex flex-col items-center justify-center gap-1 w-8">
              <button 
                onClick={() => moveRound(index, 'up')} 
                disabled={index === 0}
                className="text-slate-500 hover:text-white disabled:opacity-20"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-600">{index + 1}</span>
              <button 
                onClick={() => moveRound(index, 'down')} 
                disabled={index === rounds.length - 1}
                className="text-slate-500 hover:text-white disabled:opacity-20"
              >
                <MoveDown className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-800 rounded-lg">
              {round.type === 'NORMAL' ? (
                <Clock className="w-6 h-6 text-brand-400" />
              ) : (
                <Users className="w-6 h-6 text-emerald-400" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-white">{round.title}</h3>
              <div className="flex gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  {round.type === 'NORMAL' ? 'Standard Timer' : 'Back & Forth'}
                </span>
                <span>•</span>
                <span>{round.durationMinutes} mins</span>
                {round.speaker && (
                  <>
                    <span>•</span>
                    <span className={round.speaker === 'A' ? 'text-brand-400' : 'text-emerald-400'}>
                      Speaker {round.speaker}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button 
              onClick={() => removeRound(round.id)}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {rounds.length === 0 && (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
            No rounds added yet. Load a template or add rounds manually.
          </div>
        )}
      </div>

      {/* Add New Round Form */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-500" /> Add Custom Round
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <input 
              type="text" 
              placeholder="Round Title (e.g., Opening)" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
             <select 
               value={newType}
               onChange={(e) => setNewType(e.target.value as RoundType)}
               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
             >
               <option value="NORMAL">Standard</option>
               <option value="CHESS">Back & Forth</option>
             </select>
          </div>

          <div className="md:col-span-2 relative">
            <input 
              type="number" 
              min="1"
              value={newDuration}
              onChange={(e) => setNewDuration(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 text-sm pointer-events-none">min</span>
          </div>

          <div className="md:col-span-2">
            <select 
              value={newSpeaker}
              onChange={(e) => setNewSpeaker(e.target.value as 'A' | 'B')}
              disabled={newType !== 'NORMAL'}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none disabled:opacity-50"
            >
              <option value="A">Speaker A</option>
              <option value="B">Speaker B</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Button onClick={addRound} className="w-full" disabled={!newTitle}>Add</Button>
          </div>
        </div>
      </div>

    </div>
  );
};