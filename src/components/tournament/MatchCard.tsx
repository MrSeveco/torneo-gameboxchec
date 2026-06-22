import type { Match, Participant, MatchStatus } from '../../types/tournament';
import { Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { getTeamInfo } from '../../utils/teams';

interface MatchCardProps {
  match: Match;
  participants: Participant[];
  isAdmin?: boolean;
  onUpdateMatch?: (matchId: string, updates: Partial<Match>) => void;
}

export default function MatchCard({ match, participants, isAdmin = false, onUpdateMatch }: MatchCardProps) {
  const getParticipantName = (id: string | null) => {
    if (!id) return 'Por definir / Sorteo';
    const p = participants.find(p => p.id === id);
    return p ? p.name : 'Desconocido';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente': return 'text-[var(--color-status-pending)] border-[var(--color-status-pending)]';
      case 'Programado': return 'text-[var(--color-chec-cyan)] border-[var(--color-chec-cyan)]';
      case 'Finalizado': return 'text-[var(--color-status-success)] border-[var(--color-status-success)]';
      case 'W.O.': return 'text-[var(--color-status-wo)] border-[var(--color-status-wo)]';
      default: return 'text-[var(--color-text-secondary)] border-[var(--color-surface-alt)]';
    }
  };

  const handleScoreChange = (player: 'A' | 'B', value: string) => {
    if (!onUpdateMatch) return;
    const numValue = value === '' ? null : parseInt(value, 10);
    if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 99)) return;
    
    if (player === 'A') onUpdateMatch(match.id, { scoreA: numValue });
    else onUpdateMatch(match.id, { scoreB: numValue });
  };

  const handleStatusChange = (status: MatchStatus) => {
    if (!onUpdateMatch) return;
    const updates: Partial<Match> = { status };
    if (status === 'W.O.') {
      updates.scoreA = 1;
      updates.scoreB = 0;
    }
    onUpdateMatch(match.id, updates);
  };

  return (
    <div className={`bg-[var(--color-surface-alt)] border ${isAdmin ? 'border-[var(--color-chec-cyan)]/30' : 'border-[var(--color-surface)]'} rounded-xl p-5 hover:border-[var(--color-gamebox-green)]/30 transition-all group relative`}>
      {isAdmin && (
        <div className="absolute top-0 right-0 bg-[var(--color-chec-cyan)] text-[var(--color-bg-primary)] text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">
          EDITABLE
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--color-surface)]/50">
        <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1"><Calendar size={14} /> {match.date}</div>
          <div className="flex items-center gap-1"><Clock size={14} /> {match.time}</div>
        </div>
        
        {isAdmin ? (
          <select 
            value={match.status}
            onChange={(e) => handleStatusChange(e.target.value as MatchStatus)}
            className={`px-2 py-1 rounded text-xs font-semibold border bg-black/40 focus:outline-none ${getStatusColor(match.status)}`}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Programado">Programado</option>
            <option value="Finalizado">Finalizado</option>
            <option value="W.O.">W.O.</option>
          </select>
        ) : (
          <div className={`px-2 py-0.5 rounded text-xs font-semibold border bg-black/20 ${getStatusColor(match.status)}`}>
            {match.status}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-4">
        {/* Jugador A */}
        <div className="flex-1 flex flex-col items-end">
          <p className="font-bold text-[var(--color-text-primary)] leading-tight text-right">{getParticipantName(match.playerAId)}</p>
          {match.teamA && (() => {
            const team = getTeamInfo(match.teamA);
            return team ? (
              <div className="flex items-center gap-2 mt-1.5 bg-black/20 px-2 py-1 rounded border border-[var(--color-surface-alt)] shadow-inner" title={team.name}>
                <span className="font-black text-xs text-[var(--color-text-secondary)] tracking-wider">{team.abbr}</span>
                {team.flagUrl ? (
                  <img src={team.flagUrl} alt={team.name} className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
                ) : (
                  <span className="text-[10px] text-[var(--color-text-secondary)]">{team.name}</span>
                )}
              </div>
            ) : null;
          })()}
        </div>

        {/* Marcador / VS */}
        <div className="flex-shrink-0 bg-[var(--color-bg-primary)] p-2 rounded-lg border border-[var(--color-surface-alt)] group-hover:border-[var(--color-gamebox-green)]/50 transition-colors">
          {isAdmin ? (
            <div className="flex items-center gap-1">
              <input 
                type="number" min="0" max="99"
                value={match.scoreA === null ? '' : match.scoreA}
                onChange={(e) => handleScoreChange('A', e.target.value)}
                className="w-10 h-8 bg-black/50 text-[var(--color-text-primary)] text-center rounded border border-[var(--color-surface)] focus:border-[var(--color-gamebox-green)] focus:outline-none font-bold"
              />
              <span className="text-[var(--color-text-secondary)]">-</span>
              <input 
                type="number" min="0" max="99"
                value={match.scoreB === null ? '' : match.scoreB}
                onChange={(e) => handleScoreChange('B', e.target.value)}
                className="w-10 h-8 bg-black/50 text-[var(--color-text-primary)] text-center rounded border border-[var(--color-surface)] focus:border-[var(--color-gamebox-green)] focus:outline-none font-bold"
              />
            </div>
          ) : (
            match.scoreA !== null && match.scoreB !== null ? (
              <div className="text-xl font-black text-[var(--color-text-primary)] flex items-center gap-2 px-2">
                <span className={match.scoreA > match.scoreB ? 'text-[var(--color-gamebox-neon)]' : ''}>{match.scoreA}</span>
                <span className="text-[var(--color-text-secondary)] text-sm">-</span>
                <span className={match.scoreB > match.scoreA ? 'text-[var(--color-gamebox-neon)]' : ''}>{match.scoreB}</span>
              </div>
            ) : (
              <span className="text-lg font-black text-[var(--color-text-secondary)] italic px-2">VS</span>
            )
          )}
        </div>

        {/* Jugador B */}
        <div className="flex-1 flex flex-col items-start">
          <p className="font-bold text-[var(--color-text-primary)] leading-tight text-left">{getParticipantName(match.playerBId)}</p>
          {match.teamB && (() => {
            const team = getTeamInfo(match.teamB);
            return team ? (
              <div className="flex items-center gap-2 mt-1.5 bg-black/20 px-2 py-1 rounded border border-[var(--color-surface-alt)] shadow-inner" title={team.name}>
                {team.flagUrl ? (
                  <img src={team.flagUrl} alt={team.name} className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
                ) : (
                  <span className="text-[10px] text-[var(--color-text-secondary)]">{team.name}</span>
                )}
                <span className="font-black text-xs text-[var(--color-text-secondary)] tracking-wider">{team.abbr}</span>
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {match.evidence && match.evidence !== 'Pendiente de reporte' && !isAdmin && (
        <div className="mt-4 pt-3 border-t border-[var(--color-surface)]/50 flex items-center justify-center gap-2 text-xs text-[var(--color-chec-cyan)]">
          <ImageIcon size={14} />
          <span>Evidencia: {match.evidence}</span>
        </div>
      )}
    </div>
  );
}
