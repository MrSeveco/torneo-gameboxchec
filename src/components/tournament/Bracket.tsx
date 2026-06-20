import type { BracketRound, Participant, BracketMatch } from '../../types/tournament';

interface BracketProps {
  bracketRounds?: BracketRound[];
  participants?: Participant[];
}

export default function Bracket({ bracketRounds, participants }: BracketProps) {
  const getParticipantName = (id: string | null, fallback: string) => {
    if (!id) return fallback;
    if (!participants) return fallback;
    const p = participants.find(p => p.id === id);
    return p ? p.name : fallback;
  };

  const renderMatchNode = (match?: BracketMatch, fallbackA = 'Por definir', fallbackB = 'Por definir', dateFallback = 'Por definir') => {
    const playerA = match ? getParticipantName(match.playerAId, fallbackA) : fallbackA;
    const playerB = match ? getParticipantName(match.playerBId, fallbackB) : fallbackB;
    const scoreA = match?.scoreA ?? null;
    const scoreB = match?.scoreB ?? null;

    return (
      <div className="flex flex-col bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-md w-48 shadow-lg relative z-10">
        <div className="text-[10px] text-center text-[var(--color-text-secondary)] bg-black/20 py-1 border-b border-[var(--color-surface)]">
          {dateFallback}
        </div>
        <div className="flex justify-between items-center px-3 py-2 border-b border-[var(--color-surface)]">
          <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate max-w-[120px]" title={playerA}>{playerA}</span>
          <span className="text-xs font-black text-[var(--color-gamebox-neon)]">{scoreA ?? '-'}</span>
        </div>
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate max-w-[120px]" title={playerB}>{playerB}</span>
          <span className="text-xs font-black text-[var(--color-gamebox-neon)]">{scoreB ?? '-'}</span>
        </div>
      </div>
    );
  };

  // Safe access to rounds
  const quarters = bracketRounds?.find(r => r.id === 'R-8')?.matches || [];
  const semis = bracketRounds?.find(r => r.id === 'R-4')?.matches || [];
  const finalMatch = bracketRounds?.find(r => r.id === 'R-2')?.matches[0];

  // Calculate champion
  let championName = 'Por definir';
  if (finalMatch && finalMatch.scoreA !== null && finalMatch.scoreB !== null) {
    if (finalMatch.scoreA > finalMatch.scoreB) championName = getParticipantName(finalMatch.playerAId, 'Jugador 1');
    else if (finalMatch.scoreB > finalMatch.scoreA) championName = getParticipantName(finalMatch.playerBId, 'Jugador 2');
  }

  return (
    <div className="w-full overflow-x-auto pb-10 custom-scrollbar">
      <div className="min-w-[800px] flex justify-between items-center px-10 relative">
        {/* Connection Lines (CSS based) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Quarter to Semi */}
          <div className="absolute left-[200px] top-[75px] w-[50px] border-t-2 border-r-2 border-[var(--color-surface)] h-[130px] rounded-tr-xl"></div>
          <div className="absolute left-[200px] top-[205px] w-[50px] border-b-2 border-r-2 border-[var(--color-surface)] h-[130px] rounded-br-xl"></div>
          
          <div className="absolute left-[200px] top-[465px] w-[50px] border-t-2 border-r-2 border-[var(--color-surface)] h-[130px] rounded-tr-xl"></div>
          <div className="absolute left-[200px] top-[595px] w-[50px] border-b-2 border-r-2 border-[var(--color-surface)] h-[130px] rounded-br-xl"></div>

          {/* Semi to Final */}
          <div className="absolute left-[450px] top-[205px] w-[50px] border-t-2 border-r-2 border-[var(--color-surface)] h-[260px] rounded-tr-xl"></div>
          <div className="absolute left-[450px] top-[465px] w-[50px] border-b-2 border-r-2 border-[var(--color-surface)] h-[260px] rounded-br-xl"></div>
          
          {/* Connector to Final Box */}
          <div className="absolute left-[500px] top-[465px] w-[50px] border-t-2 border-[var(--color-surface)]"></div>
          
          {/* Final to Champion */}
          <div className="absolute left-[700px] top-[465px] w-[50px] border-t-2 border-[var(--color-gamebox-green)]"></div>
        </div>

        {/* Quarter Finals */}
        <div className="flex flex-col gap-[140px] py-4">
          <div className="text-center mb-[-120px] text-sm font-bold text-[var(--color-chec-cyan)] uppercase tracking-widest">Cuartos</div>
          {renderMatchNode(quarters[0], 'Clasificado 1 G1', 'Mejor 3ro B', 'Por definir')}
          {renderMatchNode(quarters[1], 'Clasificado 1 G2', 'Clasificado 2 G3', 'Por definir')}
          {renderMatchNode(quarters[2], 'Clasificado 1 G3', 'Clasificado 2 G1', 'Por definir')}
          {renderMatchNode(quarters[3], 'Mejor 3ro A', 'Clasificado 2 G2', 'Por definir')}
        </div>

        {/* Semi Finals */}
        <div className="flex flex-col gap-[400px] py-4 mt-[130px]">
          <div className="text-center mb-[-380px] text-sm font-bold text-[var(--color-chec-cyan)] uppercase tracking-widest absolute top-4 left-[350px]">Semifinal</div>
          {renderMatchNode(semis[0], 'Ganador Llave 1', 'Ganador Llave 2', 'Por definir')}
          {renderMatchNode(semis[1], 'Ganador Llave 3', 'Ganador Llave 4', 'Por definir')}
        </div>

        {/* Final */}
        <div className="flex flex-col py-4">
          <div className="text-center mb-4 text-sm font-bold text-[var(--color-gamebox-neon)] uppercase tracking-widest absolute top-4 left-[570px]">Gran Final</div>
          <div className="shadow-[0_0_20px_rgba(4,168,221,0.2)] rounded-md">
            {renderMatchNode(finalMatch, 'Finalista 1', 'Finalista 2', 'Gran Final')}
          </div>
        </div>

        {/* Champion */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-gamebox-green)] to-[var(--color-chec-cyan)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(132,199,42,0.4)] relative z-10">
            <div className="w-[120px] h-[120px] bg-[var(--color-bg-primary)] rounded-full flex flex-col items-center justify-center text-center p-2">
              <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Campeón</span>
              <span className="text-sm font-black text-[var(--color-text-primary)] leading-tight">{championName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
