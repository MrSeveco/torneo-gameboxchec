import type { Match, Participant, TournamentGroup, MatchStatus } from '../../types/tournament';
import { Camera } from 'lucide-react';

interface ResultsTableProps {
  matches: Match[];
  participants: Participant[];
  groups: TournamentGroup[];
  isAdmin?: boolean;
  onUpdateMatch?: (matchId: string, updates: Partial<Match>) => void;
}

export default function ResultsTable({ matches, participants, groups, isAdmin = false, onUpdateMatch }: ResultsTableProps) {
  const getParticipantName = (id: string | null) => {
    if (!id) return 'Por definir';
    const participant = participants.find(p => p.id === id);
    return participant ? participant.name : 'Por definir';
  };

  const getGroupName = (id: string | null) => {
    if (!id) return 'Fase Eliminatoria';
    const g = groups.find(g => g.id === id);
    return g ? g.name : 'Grupo';
  };

  // In admin mode, show all matches. In public mode, show only matches with scores or W.O.
  const results = isAdmin ? matches : matches.filter(m => m.scoreA !== null && m.scoreB !== null || m.status === 'W.O.');

  if (results.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] rounded-xl border border-dashed border-[var(--color-surface)]">
        Aún no hay resultados reportados.
      </div>
    );
  }

  const handleScoreChange = (matchId: string, player: 'A' | 'B', value: string) => {
    if (!onUpdateMatch) return;
    const numValue = value === '' ? null : parseInt(value, 10);
    // validación básica 0-99
    if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 99)) return;
    
    if (player === 'A') onUpdateMatch(matchId, { scoreA: numValue });
    else onUpdateMatch(matchId, { scoreB: numValue });
  };

  const handleStatusChange = (matchId: string, status: MatchStatus) => {
    if (!onUpdateMatch) return;
    const updates: Partial<Match> = { status };
    if (status === 'W.O.') {
      // Por defecto 1-0 para A, el admin puede cambiarlo luego si fue W.O. de A en lugar de B.
      updates.scoreA = 1;
      updates.scoreB = 0;
    }
    onUpdateMatch(matchId, updates);
  };

  const handleEvidenceChange = (matchId: string, evidence: any) => {
    if (onUpdateMatch) onUpdateMatch(matchId, { evidence });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-surface-alt)] custom-scrollbar">
      <table className="min-w-full divide-y divide-[var(--color-surface-alt)]">
        <thead className="bg-[var(--color-surface)]">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Grupo/Fecha</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Jugador A</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Resultado</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Jugador B</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Evidencia</th>
          </tr>
        </thead>
        <tbody className="bg-[var(--color-surface-alt)] divide-y divide-[var(--color-surface)]">
          {results.map((match) => (
            <tr key={match.id} className="hover:bg-[var(--color-surface)] transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[var(--color-text-primary)]">{getGroupName(match.groupId)}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">{match.date} - {match.time}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <div className={`text-sm font-bold ${match.scoreA !== null && match.scoreA > (match.scoreB || 0) ? 'text-[var(--color-gamebox-neon)]' : 'text-[var(--color-text-primary)]'}`}>
                  {getParticipantName(match.playerAId)}
                </div>
                {match.teamA && <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{match.teamA}</div>}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center">
                {isAdmin ? (
                  <div className="flex items-center justify-center gap-2">
                    <input 
                      type="number" 
                      min="0" max="99"
                      value={match.scoreA === null ? '' : match.scoreA}
                      onChange={(e) => handleScoreChange(match.id, 'A', e.target.value)}
                      className="w-12 h-8 bg-black/30 border border-[var(--color-surface-alt)] text-[var(--color-text-primary)] text-center rounded focus:border-[var(--color-chec-cyan)] focus:outline-none font-bold"
                    />
                    <span className="text-[var(--color-text-secondary)]">-</span>
                    <input 
                      type="number" 
                      min="0" max="99"
                      value={match.scoreB === null ? '' : match.scoreB}
                      onChange={(e) => handleScoreChange(match.id, 'B', e.target.value)}
                      className="w-12 h-8 bg-black/30 border border-[var(--color-surface-alt)] text-[var(--color-text-primary)] text-center rounded focus:border-[var(--color-chec-cyan)] focus:outline-none font-bold"
                    />
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center bg-[var(--color-bg-primary)] px-3 py-1 rounded-md border border-[var(--color-surface-alt)]">
                    <span className="text-lg font-black text-[var(--color-text-primary)]">{match.scoreA ?? '-'} - {match.scoreB ?? '-'}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-left">
                <div className={`text-sm font-bold ${match.scoreB !== null && match.scoreB > (match.scoreA || 0) ? 'text-[var(--color-gamebox-neon)]' : 'text-[var(--color-text-primary)]'}`}>
                  {getParticipantName(match.playerBId)}
                </div>
                {match.teamB && <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{match.teamB}</div>}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center">
                {isAdmin ? (
                  <select 
                    value={match.status}
                    onChange={(e) => handleStatusChange(match.id, e.target.value as MatchStatus)}
                    className="bg-black/30 border border-[var(--color-surface-alt)] text-[var(--color-text-primary)] text-xs rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Programado">Programado</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="W.O.">W.O.</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-black/20 border ${match.status === 'W.O.' ? 'text-[var(--color-status-wo)] border-[var(--color-status-wo)]' : match.status === 'Finalizado' ? 'text-[var(--color-status-success)] border-[var(--color-status-success)]' : 'text-gray-400 border-gray-600'}`}>
                    {match.status}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">
                {isAdmin ? (
                  <select 
                    value={match.evidence}
                    onChange={(e) => handleEvidenceChange(match.id, e.target.value as any)}
                    className="bg-black/30 border border-[var(--color-surface-alt)] text-[var(--color-text-secondary)] text-xs rounded px-2 py-1 focus:outline-none w-24"
                  >
                    <option value="Pendiente de reporte">Pendiente</option>
                    <option value="Recibida">Recibida</option>
                    <option value="Validada">Validada</option>
                  </select>
                ) : (
                  match.evidence && match.evidence !== 'Pendiente de reporte' ? (
                    <button className="text-[var(--color-chec-cyan)] hover:text-[var(--color-text-primary)] transition-colors" title={match.evidence}>
                      <Camera size={18} className="mx-auto" />
                    </button>
                  ) : (
                    <span className="text-xs italic">Pendiente</span>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
