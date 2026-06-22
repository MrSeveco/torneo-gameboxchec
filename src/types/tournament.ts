export type ParticipantType = 'Trabajador CHEC' | 'Aprendiz SENA' | 'Acompañante' | 'Comité' | 'Otro';

export type TechnicalStatus = 
  | 'Listo Consola + Membresía'
  | 'Requiere Consola'
  | 'Requiere Membresía'
  | 'Requiere Consola + Membresía'
  | 'Autónomo'
  | 'Pendiente';

export interface Participant {
  id: string;
  name: string;
  type: ParticipantType;
  groupId: string | null;
  technicalStatus: TechnicalStatus;
  consoleAssigned: string | null;
  membership: string | null;
  logisticsNotes: string;
  isActive: boolean;
}

export type GroupStatus = 'Pendiente de sorteo' | 'Programado' | 'En curso' | 'Finalizado';

export interface TournamentGroup {
  id: string;
  name: string;
  description: string;
  participantsIds: string[];
  qualifiedCount: number;
  status: GroupStatus;
  order: number;
}

export type MatchRound = 'Fase de grupos' | 'Octavos' | 'Cuartos' | 'Semifinal' | 'Tercer puesto' | 'Final';
export type MatchStatus = 'Pendiente' | 'Programado' | 'En curso' | 'Finalizado' | 'W.O.' | 'Reprogramado' | 'Cancelado';
export type EvidenceStatus = 'Pendiente de reporte' | 'Recibida' | 'En revisión' | 'Validada' | 'Rechazada';
export type PlatformType = 'PS5' | 'Xbox Series X' | 'Xbox Series S' | 'Por definir';

export interface Match {
  id: string;
  groupId: string | null;
  round: MatchRound;
  playerAId: string | null;
  playerBId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  teamA?: string;
  teamB?: string;
  date: string;
  time: string;
  platform: PlatformType;
  status: MatchStatus;
  evidence: EvidenceStatus;
  notes: string;
}

export type ScheduleItemType = 'Partido' | 'Logística' | 'Entrega de consola' | 'Recogida de consola' | 'Eliminatoria' | 'Final' | 'Comité';
export type ScheduleItemStatus = 'Listo' | 'Requiere consola' | 'Requiere membresía' | 'Requiere consola + membresía' | 'Autónomo' | 'Pendiente' | 'Comité' | 'Finalizado';

export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  title: string; // name/participant/activity
  type: ScheduleItemType;
  status: ScheduleItemStatus;
  logistics: string;
  notes: string;
}

export type ConsoleStatus = 'Disponible' | 'Asignada' | 'Entregada' | 'Devuelta' | 'Pendiente devolución' | 'Novedad';
export interface ConsoleLoan {
  id: string;
  participantId: string | null;
  deliveryDate: string;
  returnDate: string;
  status: ConsoleStatus;
  notes: string;
}

export type MembershipStatus = 'Pendiente' | 'Asignada' | 'Activa' | 'No requerida';
export interface MembershipAssignment {
  id: string;
  participantId: string | null;
  status: MembershipStatus;
  notes: string;
}

export interface RuleItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  visible: boolean;
  order: number;
}

  export interface StandingRow {
    id: string; // participantId
    participantId: string;
    position?: number;
    name: string;
  groupId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  
  // Custom manual overrides
  extraPoints: number;
  penaltyPoints: number;
  penaltyReason: string;
  isManualOverride: boolean;
}

export interface QualifiedParticipant {
  id: string;
  participantId: string;
  groupId: string;
  rank: number; // Clasificado 1, Clasificado 2
  notes: string;
}

export interface BracketMatch {
  id: string;
  roundId: string; // 'Octavos', 'Cuartos'
  playerAId: string | null;
  playerBId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  winnerId: string | null;
  nextMatchId: string | null; // Pointer to next node
  status: MatchStatus;
}

export interface BracketRound {
  id: string; // e.g. 'R-16', 'R-8'
  name: string; // 'Octavos de Final', 'Cuartos de Final'
  order: number;
  matches: BracketMatch[];
}

export type TournamentStatus = 'Planeación' | 'Programado' | 'En curso' | 'Finalizado';

export interface TournamentConfig {
  name: string;
  subtitle: string;
  description: string;
  year: string;
  modality: string;
  games: string;
  platforms: string;
  dates: string;
  heroText: string;
  heroChips: string[]; // e.g. ["24 Participantes", "Fase de Grupos", "Presencial"]
  footerText: string;
  organizerName: string;
  privacyNote: string;
  status: TournamentStatus;
  visibleSections: {
    hero: boolean;
    groups: boolean;
    vs: boolean;
    results: boolean;
    standings: boolean;
    qualified: boolean;
    bracket: boolean;
    schedule: boolean;
    rules: boolean;
    logistics: boolean;
  };
}

export interface TournamentThemeConfig {
  theme: 'Oscuro gamer' | 'Institucional' | 'Alto contraste';
  primaryColor: string; // HEX
  secondaryColor: string; // HEX
  accentColor: string; // HEX
  showGradient: boolean;
  showNeon: boolean;
  logoSize: 'Pequeño' | 'Mediano' | 'Grande';
}

export interface TournamentStats {
  useAutoStats: boolean;
  totalEnrolled: number;
  starters: number;
  companions: number;
  committeeConsoles: number;
  needsSupport: number;
  inConditions: number;
  groupCount: number;
  scheduledMatches: number;
  playedMatches: number;
  qualifiedCount: number;
}

export interface TournamentData {
  config: TournamentConfig;
  theme: TournamentThemeConfig;
  stats: TournamentStats;
  participants: Participant[];
  groups: TournamentGroup[];
  matches: Match[];
  schedule: ScheduleItem[];
  rules: RuleItem[];
  consoleLoans: ConsoleLoan[];
  membershipAssignments: MembershipAssignment[];
  
  // Advanced tracking
  standingsMode: 'auto' | 'manual';
  manualStandings: StandingRow[];
  
  qualifiedMode: 'auto' | 'manual';
  qualified: QualifiedParticipant[];
  
  bracketMode: 'auto' | 'manual';
  bracketRounds: BracketRound[];
}

export interface AdminEditableData extends TournamentData {
  // Para extender en el CMS si es necesario
}
