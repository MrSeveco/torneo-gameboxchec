import type { Match, StandingRow, TournamentGroup } from '../types/tournament';

export function calculateStandings(group: TournamentGroup, matches: Match[], participantsData: any[]): StandingRow[] {
  const standingsMap: Record<string, StandingRow> = {};

  // Inicializar todos los participantes del grupo con 0
  group.participantsIds.forEach(participantId => {
    const participant = participantsData.find(p => p.id === participantId);
    standingsMap[participantId] = {
      id: participantId,
      participantId,
      groupId: group.id,
      position: 0,
      name: participant ? participant.name : 'Desconocido',
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      extraPoints: 0,
      penaltyPoints: 0,
      penaltyReason: '',
      isManualOverride: false
    };
  });

  // Calcular resultados
  const groupMatches = matches.filter(m => m.groupId === group.id && m.status === 'Finalizado' && m.scoreA !== null && m.scoreB !== null);
  
  groupMatches.forEach(match => {
    if (!match.playerAId || !match.playerBId) return;

    const rowA = standingsMap[match.playerAId];
    const rowB = standingsMap[match.playerBId];

    if (!rowA || !rowB) return;

    rowA.played += 1;
    rowB.played += 1;

    const scoreA = match.scoreA!;
    const scoreB = match.scoreB!;

    rowA.goalsFor += scoreA;
    rowA.goalsAgainst += scoreB;
    rowA.goalDifference = rowA.goalsFor - rowA.goalsAgainst;

    rowB.goalsFor += scoreB;
    rowB.goalsAgainst += scoreA;
    rowB.goalDifference = rowB.goalsFor - rowB.goalsAgainst;

    if (scoreA > scoreB) {
      rowA.won += 1;
      rowA.points += 3;
      rowB.lost += 1;
    } else if (scoreA < scoreB) {
      rowB.won += 1;
      rowB.points += 3;
      rowA.lost += 1;
    } else {
      rowA.drawn += 1;
      rowA.points += 1;
      rowB.drawn += 1;
      rowB.points += 1;
    }
  });

  // W.O. handling
  const woMatches = matches.filter(m => m.groupId === group.id && m.status === 'W.O.');
  woMatches.forEach(match => {
     if (!match.playerAId || !match.playerBId) return;
     const rowA = standingsMap[match.playerAId];
     const rowB = standingsMap[match.playerBId];
     if (!rowA || !rowB) return;

     if (match.scoreA === 1 && match.scoreB === 0) {
       rowA.played += 1; rowB.played += 1;
       rowA.won += 1; rowB.lost += 1;
       rowA.goalsFor += 1; rowB.goalsAgainst += 1;
       rowA.goalDifference += 1; rowB.goalDifference -= 1;
       rowA.points += 3;
     } else if (match.scoreB === 1 && match.scoreA === 0) {
       rowA.played += 1; rowB.played += 1;
       rowB.won += 1; rowA.lost += 1;
       rowB.goalsFor += 1; rowA.goalsAgainst += 1;
       rowB.goalDifference += 1; rowA.goalDifference -= 1;
       rowB.points += 3;
     }
  });

  // Ordenar
  const standingsArray = Object.values(standingsMap);
  standingsArray.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });

  // Asignar posiciones
  standingsArray.forEach((row, index) => {
    row.position = index + 1;
  });

  return standingsArray;
}
