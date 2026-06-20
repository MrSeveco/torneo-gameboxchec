import type { 
  TournamentData, 
  Participant, 
  TournamentGroup, 
  Match, 
  ScheduleItem, 
  RuleItem
} from '../types/tournament';

export const ENABLE_EDIT_MODE = true;
export const QUALIFIERS_PER_GROUP = 2; 

const defaultRules: RuleItem[] = [
  { id: '1', title: 'Modalidad', description: '100% virtual, 1 vs 1, Amistoso online.', icon: '🎮', visible: true, order: 1 },
  { id: '2', title: 'Videojuego', description: 'EA SPORTS FC 26 / FIFA 2026 y EA SPORTS FC 25 / FIFA 2025.', icon: '⚽', visible: true, order: 2 },
  { id: '3', title: 'Consolas', description: 'PlayStation 5, Xbox Series X y Xbox Series S.', icon: '📺', visible: true, order: 3 },
  { id: '4', title: 'Formato', description: 'Fase de grupos y eliminación directa.', icon: '🏆', visible: true, order: 4 },
  { id: '5', title: 'Duración', description: '6 minutos por tiempo. Velocidad normal. Clima predeterminado.', icon: '⏱️', visible: true, order: 5 },
  { id: '6', title: 'Presentación', description: 'Mínimo 10 minutos antes. Espera máxima 5 minutos.', icon: '⏰', visible: true, order: 6 },
  { id: '7', title: 'Fallas técnicas', description: 'Antes del min 15: se reinicia. Después del min 15: se reprograma.', icon: '⚠️', visible: true, order: 7 },
  { id: '8', title: 'W.O.', description: 'Inasistencia o falta injustificada = Marcador 1-0 en contra. Dos inasistencias = exclusión.', icon: '❌', visible: true, order: 8 },
  { id: '9', title: 'Reporte', description: 'El resultado debe reportarse con evidencia mediante captura de pantalla o foto.', icon: '📸', visible: true, order: 9 },
  { id: '10', title: 'Juego limpio', description: 'Respeto, transparencia, equidad y sana competencia.', icon: '🤝', visible: true, order: 10 }
];

const defaultParticipants: Participant[] = [
  // 22 de junio
  { id: 'p1', name: 'Jhon Sebastian Lopez Osorio', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #1', isActive: true },
  { id: 'p2', name: 'Alejandro Tabares Ospina', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #2', isActive: true },
  { id: 'p3', name: 'Juan David Bustamante Foronda', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #3', isActive: true },
  { id: 'p4', name: 'Daniel Eduardo Isaza Castro', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #4', isActive: true },
  { id: 'p5', name: 'Jesus Eduardo Castrillon Valencia', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Requiere Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Asignar membresía', isActive: true },
  { id: 'p6', name: 'Yoiner Tabares Galvis', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Requiere Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Asignar membresía', isActive: true },
  { id: 'p7', name: 'Andres Mateo Ramos Duque', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p8', name: 'Mateo Camilo Campos Agudelo', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p9', name: 'Sergio Alexander Ramirez Franco', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p10', name: 'Esteban Galvis Cardona', type: 'Trabajador CHEC', groupId: 'g1', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p11', name: 'Kevin Alejandro Parada Jimenez', type: 'Acompañante', groupId: 'g1', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p12', name: 'Mateo Delgado Ramirez', type: 'Acompañante', groupId: 'g1', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  
  // 24 de junio
  { id: 'p13', name: 'Jeferson Cardona Duarte', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #1', isActive: true },
  { id: 'p14', name: 'Jose Aurelio Alonso Polo', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #2', isActive: true },
  { id: 'p15', name: 'John Edison Rivas Ramirez', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #3', isActive: true },
  { id: 'p16', name: 'Steven Mafla Uchima', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #4', isActive: true },
  { id: 'p17', name: 'Anderzon David Hernandez Gil', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Requiere Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Asignar membresía', isActive: true },
  { id: 'p18', name: 'Cristian Cubillos Aristizabal', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p19', name: 'Alvaro Ivan Parada Pachon', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p20', name: 'Manuel Alejandro Restrepo Salazar', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p21', name: 'Andres Felipe Torres', type: 'Trabajador CHEC', groupId: 'g2', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p22', name: 'Jerónimo Torres González', type: 'Acompañante', groupId: 'g2', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p23', name: 'Alejandro torres González', type: 'Acompañante', groupId: 'g2', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },

  // 25 de junio
  { id: 'p24', name: 'Carolina Serna Gallego', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #1', isActive: true },
  { id: 'p25', name: 'Davinson Jesus Rivera Monroy', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #2', isActive: true },
  { id: 'p26', name: 'Mario Andres Benjumea Benjumea', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Requiere Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #3', isActive: true },
  { id: 'p27', name: 'German Dario Delgado Valencia', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Requiere Consola', consoleAssigned: null, membership: null, logisticsNotes: 'Consola #4', isActive: true },
  { id: 'p28', name: 'Miguel Angel Orozco Lopez', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p29', name: 'Victor Hugo Cardona Lopez', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p30', name: 'Sergio Marulanda Mazo', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p31', name: 'Brayan Mateo Cortes Gil', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p32', name: 'Pedro Jose Toro Chavez', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p33', name: 'Julian David Giraldo Arias', type: 'Trabajador CHEC', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p34', name: 'Juan Camilo Cardona castaño', type: 'Acompañante', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true },
  { id: 'p35', name: 'Emmanuel Carmona Giraldo', type: 'Acompañante', groupId: 'g3', technicalStatus: 'Listo Consola + Membresía', consoleAssigned: null, membership: null, logisticsNotes: 'Autónomo', isActive: true }
];

const defaultGroups: TournamentGroup[] = [
  { id: 'g1', name: 'Grupo 1 (22 de Junio)', description: 'Bloque 1', participantsIds: defaultParticipants.slice(0, 12).map(p => p.id), qualifiedCount: 2, status: 'Pendiente de sorteo', order: 1 },
  { id: 'g2', name: 'Grupo 2 (24 de Junio)', description: 'Bloque 2', participantsIds: defaultParticipants.slice(12, 23).map(p => p.id), qualifiedCount: 2, status: 'Pendiente de sorteo', order: 2 },
  { id: 'g3', name: 'Grupo 3 (25 de Junio)', description: 'Bloque 3', participantsIds: defaultParticipants.slice(23).map(p => p.id), qualifiedCount: 2, status: 'Pendiente de sorteo', order: 3 }
];

const defaultSchedule: ScheduleItem[] = [
  { id: 's1', date: '22 de junio', time: '07:00 PM', title: 'Jhon Sebastian Lopez Osorio', type: 'Partido', status: 'Pendiente', logistics: 'Consola #1', notes: '' },
  { id: 's13', date: '23 de junio', time: 'TODO EL DÍA', title: 'Recogida y logística de consolas', type: 'Logística', status: 'Comité', logistics: '', notes: 'Recoger 4 consolas del grupo 1 y entregar al grupo 2' }
];

const defaultMatches: Match[] = [
  { id: 'm1', groupId: 'g1', round: 'Fase de grupos', playerAId: 'p1', playerBId: 'p2', scoreA: null, scoreB: null, date: '22 de junio', time: '07:00 PM', platform: 'Por definir', status: 'Pendiente', evidence: 'Pendiente de reporte', notes: '' },
  { id: 'm2', groupId: 'g1', round: 'Fase de grupos', playerAId: 'p3', playerBId: 'p4', scoreA: null, scoreB: null, date: '22 de junio', time: '07:30 PM', platform: 'Por definir', status: 'Pendiente', evidence: 'Pendiente de reporte', notes: '' },
  { id: 'm3', groupId: 'g2', round: 'Fase de grupos', playerAId: 'p13', playerBId: 'p14', scoreA: null, scoreB: null, date: '24 de junio', time: '07:00 PM', platform: 'Por definir', status: 'Pendiente', evidence: 'Pendiente de reporte', notes: '' },
  { id: 'm4', groupId: 'g3', round: 'Fase de grupos', playerAId: 'p24', playerBId: null, scoreA: null, scoreB: null, date: '25 de junio', time: '07:00 PM', platform: 'Por definir', status: 'Pendiente', evidence: 'Pendiente de reporte', notes: '' }
];

export const initialTournamentData: TournamentData = {
  config: {
    name: "Torneo Gamers CHEC 2026",
    subtitle: "Competencia · Diversión · Comunidad",
    description: "Únete al torneo oficial de esports de CHEC. Participa, compite y demuestra tus habilidades en el campo de juego virtual.",
    year: "2026",
    modality: "100% Virtual / Presencial",
    games: "EA SPORTS FC 26 / FIFA 2026",
    platforms: "PS5, Xbox Series X/S",
    dates: "22 al 26 de Junio",
    heroText: "Bienvenido al torneo más esperado del año",
    heroChips: ["Fase de Grupos", "35 Participantes", "Eliminatoria"],
    footerText: "Comité de Deportes CHEC • Landing informativa privada",
    organizerName: "Comité de Deportes CHEC",
    privacyNote: "Los datos recopilados son exclusivamente para la organización logística del torneo.",
    status: "Planeación",
    visibleSections: {
      hero: true, groups: true, vs: true, results: true, standings: true, qualified: true, bracket: true, schedule: true, rules: true, logistics: true
    }
  },
  theme: {
    theme: 'Oscuro gamer',
    primaryColor: '#84c72a', // gamebox green
    secondaryColor: '#0079c1', // chec blue
    accentColor: '#00a3e0', // chec cyan
    showGradient: true,
    showNeon: true,
    logoSize: 'Mediano'
  },
  stats: {
    useAutoStats: true,
    totalEnrolled: 35,
    starters: 29,
    companions: 6,
    committeeConsoles: 4,
    needsSupport: 18,
    inConditions: 17,
    groupCount: 3,
    scheduledMatches: 4,
    playedMatches: 0,
    qualifiedCount: 6
  },
  participants: defaultParticipants,
  groups: defaultGroups,
  matches: defaultMatches,
  schedule: defaultSchedule,
  rules: defaultRules,
  consoleLoans: [],
  membershipAssignments: [],
  standingsMode: 'auto',
  manualStandings: [],
  qualifiedMode: 'auto',
  qualified: [],
  bracketMode: 'auto',
  bracketRounds: []
};
