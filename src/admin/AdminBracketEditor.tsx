import { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import type { BracketRound, BracketMatch } from '../types/tournament';

interface Props {
  data: ReturnType<typeof import('../hooks/useTournamentData').useTournamentData>;
}

const DEFAULT_BRACKET: BracketRound[] = [
  {
    id: 'R-8', name: 'Cuartos de Final', order: 1,
    matches: [
      { id: 'q1', roundId: 'R-8', playerAId: null, playerBId: null, scoreA: null, scoreB: null, winnerId: null, nextMatchId: 's1', status: 'Pendiente' },
      { id: 'q2', roundId: 'R-8', playerAId: null, playerBId: null, scoreA: null, scoreB: null, winnerId: null, nextMatchId: 's1', status: 'Pendiente' },
      { id: 'q3', roundId: 'R-8', playerAId: null, playerBId: null, scoreA: null, scoreB: null, winnerId: null, nextMatchId: 's2', status: 'Pendiente' },
      { id: 'q4', roundId: 'R-8', playerAId: null, playerBId: null, scoreA: null, scoreB: null, winnerId: null, nextMatchId: 's2', status: 'Pendiente' },
    ]
  },
  {
    id: 'R-4', name: 'Semifinal', order: 2,
    matches: [
      { id: 's1', roundId: 'R-4', playerAId: null, playerBId: null, scoreA: null, scoreB: null, winnerId: null, nextMatchId: 'f1', status: 'Pendiente' },
      { id: 's2', roundId: 'R-4', playerAId: null, playerBId: null, scoreA: null, scoreB: null, winnerId: null, nextMatchId: 'f1', status: 'Pendiente' },
    ]
  },
  {
    id: 'R-2', name: 'Gran Final', order: 3,
    matches: [
      { id: 'f1', roundId: 'R-2', playerAId: null, playerBId: null, scoreA: null, scoreB: null, winnerId: null, nextMatchId: null, status: 'Pendiente' },
    ]
  }
];

export default function AdminBracketEditor({ data }: Props) {
  const { participants, bracketRounds, updateSection } = data;
  const [localRounds, setLocalRounds] = useState<BracketRound[]>([]);

  useEffect(() => {
    if (bracketRounds && bracketRounds.length > 0) {
      setLocalRounds(bracketRounds);
    } else {
      setLocalRounds(DEFAULT_BRACKET);
    }
  }, [bracketRounds]);

  const handleUpdateMatch = (roundId: string, matchId: string, updates: Partial<BracketMatch>) => {
    setLocalRounds(prev => prev.map(round => {
      if (round.id !== roundId) return round;
      return {
        ...round,
        matches: round.matches.map(m => m.id === matchId ? { ...m, ...updates } : m)
      };
    }));
  };

  const handleSave = () => {
    updateSection('bracketRounds', localRounds);
    updateSection('bracketMode', 'manual');
  };

  const activeParticipants = participants.filter(p => p.isActive);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Bracket / Eliminatorias</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Asigna manualmente a los clasificados en sus llaves correspondientes y actualiza los marcadores.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors"
        >
          <Save size={16} /> Guardar Bracket
        </button>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3 text-sm text-blue-800 shadow-sm">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
        <p>Configura primero los enfrentamientos de <strong>Cuartos de Final</strong>. A medida que avancen los partidos, podrás venir aquí a asignar a los ganadores en las rondas de Semifinal y Final.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {localRounds.map(round => (
          <div key={round.id} className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[var(--color-surface)] px-4 py-3 border-b border-[var(--color-surface-alt)] text-center font-bold text-[var(--color-chec-cyan)] uppercase tracking-wider text-sm">
              {round.name}
            </div>
            <div className="p-4 space-y-6 flex-1 flex flex-col justify-center">
              {round.matches.map((match, idx) => (
                <div key={match.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg p-3 relative group">
                  <div className="absolute -top-2 -left-2 bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-[10px] px-2 py-0.5 rounded border border-[var(--color-surface-alt)]">
                    Match {idx + 1}
                  </div>
                  
                  {/* Jugador A */}
                  <div className="flex items-center gap-2 mb-2">
                    <select 
                      value={match.playerAId || ''}
                      onChange={(e) => handleUpdateMatch(round.id, match.id, { playerAId: e.target.value || null })}
                      className="flex-1 bg-[var(--color-surface)] border border-[var(--color-surface-alt)] text-[var(--color-text-primary)] text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-chec-cyan)]"
                    >
                      <option value="">-- Seleccionar Jugador --</option>
                      {activeParticipants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input 
                      type="number" min="0" max="99"
                      value={match.scoreA === null ? '' : match.scoreA}
                      onChange={(e) => handleUpdateMatch(round.id, match.id, { scoreA: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                      className="w-12 bg-black/30 border border-[var(--color-surface-alt)] text-[var(--color-text-primary)] text-center text-sm rounded px-1 py-1 font-bold focus:outline-none"
                      placeholder="-"
                    />
                  </div>

                  {/* Jugador B */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={match.playerBId || ''}
                      onChange={(e) => handleUpdateMatch(round.id, match.id, { playerBId: e.target.value || null })}
                      className="flex-1 bg-[var(--color-surface)] border border-[var(--color-surface-alt)] text-[var(--color-text-primary)] text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-chec-cyan)]"
                    >
                      <option value="">-- Seleccionar Jugador --</option>
                      {activeParticipants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input 
                      type="number" min="0" max="99"
                      value={match.scoreB === null ? '' : match.scoreB}
                      onChange={(e) => handleUpdateMatch(round.id, match.id, { scoreB: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                      className="w-12 bg-black/30 border border-[var(--color-surface-alt)] text-[var(--color-text-primary)] text-center text-sm rounded px-1 py-1 font-bold focus:outline-none"
                      placeholder="-"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
