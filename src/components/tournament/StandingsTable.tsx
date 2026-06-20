import type { TournamentGroup, Match, Participant } from '../../types/tournament';
import { calculateStandings } from '../../utils/standings';
import { QUALIFIERS_PER_GROUP } from '../../data/tournamentData';

interface StandingsTableProps {
  groups: TournamentGroup[];
  matches: Match[];
  participants: Participant[];
}

export default function StandingsTable({ groups, matches, participants }: StandingsTableProps) {
  return (
    <div className="space-y-10">
      {groups.map((group) => {
        const standings = calculateStandings(group, matches, participants);
        
        return (
          <div key={group.id} className="bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-surface)] overflow-hidden">
            <div className="bg-[var(--color-surface)] px-6 py-4 border-b border-[var(--color-surface-alt)] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{group.name}</h3>
              <span className="text-xs font-medium text-[var(--color-chec-cyan)] bg-[var(--color-bg-primary)] px-2 py-1 rounded border border-[var(--color-chec-cyan)]/20">
                Clasifican {QUALIFIERS_PER_GROUP}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--color-surface)]">
                <thead className="bg-[var(--color-surface-alt)]">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase">Pos</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase">Participante</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase" title="Partidos Jugados">PJ</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase" title="Partidos Ganados">PG</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase" title="Partidos Empatados">PE</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase" title="Partidos Perdidos">PP</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase" title="Goles a Favor">GF</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase" title="Goles en Contra">GC</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase" title="Diferencia de Gol">DG</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-[var(--color-gamebox-neon)] uppercase" title="Puntos">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-surface)]">
                  {standings.map((row) => (
                    <tr 
                      key={row.participantId} 
                      className={`hover:bg-[var(--color-surface)] transition-colors ${(row.position || 0) <= QUALIFIERS_PER_GROUP ? 'bg-[var(--color-gamebox-green)]/5' : ''}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`w-6 text-center font-bold mr-3 ${
                        (row.position || 0) === 1 ? 'text-yellow-500' :
                        (row.position || 0) === 2 ? 'text-gray-400' :
                        (row.position || 0) === 3 ? 'text-amber-700' :
                        'text-[var(--color-text-secondary)]'
                      }`}>
                        {row.position || '-'}
                      </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-bold text-[var(--color-text-primary)]">{row.name}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">{row.played}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">{row.won}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">{row.drawn}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">{row.lost}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">{row.goalsFor}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">{row.goalsAgainst}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text-secondary)]">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-black text-[var(--color-gamebox-neon)]">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
