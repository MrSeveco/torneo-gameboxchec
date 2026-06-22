import { useState } from 'react';
import { X, Edit2, Trash2, Save, Plus, Calendar, Clock } from 'lucide-react';
import type { Match, MatchRound, PlatformType, MatchStatus, EvidenceStatus } from '../types/tournament';

interface Props {
  data: ReturnType<typeof import('../hooks/useTournamentData').useTournamentData>;
}

const MATCH_ROUNDS: MatchRound[] = ['Fase de grupos', 'Octavos', 'Cuartos', 'Semifinal', 'Tercer puesto', 'Final'];
const PLATFORMS: PlatformType[] = ['PS5', 'Xbox Series X', 'Xbox Series S', 'Por definir'];
const MATCH_STATUSES: MatchStatus[] = ['Pendiente', 'Programado', 'En curso', 'Finalizado', 'W.O.', 'Reprogramado', 'Cancelado'];
const EVIDENCE_STATUSES: EvidenceStatus[] = ['Pendiente de reporte', 'Recibida', 'En revisión', 'Validada', 'Rechazada'];

export default function AdminMatchesEditor({ data }: Props) {
  const { matches, participants, groups, updateSection } = data;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Match>>({});

  const handleOpenModal = (match?: Match) => {
    if (match) {
      setEditingId(match.id);
      setFormData({ ...match });
    } else {
      setEditingId(null);
      setFormData({
        groupId: groups[0]?.id || null,
        round: 'Fase de grupos',
        playerAId: null,
        playerBId: null,
        teamA: '',
        teamB: '',
        scoreA: null,
        scoreB: null,
        date: '',
        time: '',
        platform: 'Por definir',
        status: 'Pendiente',
        evidence: 'Pendiente de reporte',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSave = () => {
    let newMatches = [...matches];
    if (editingId) {
      newMatches = newMatches.map(m => m.id === editingId ? { ...m, ...formData } as Match : m);
    } else {
      const newMatch: Match = {
        ...(formData as Match),
        id: `m${Date.now()}`
      };
      newMatches.push(newMatch);
    }
    
    updateSection('matches', newMatches);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este partido?')) {
      updateSection('matches', matches.filter(m => m.id !== id));
    }
  };

  const getParticipantName = (id: string | null) => {
    if (!id) return 'Por definir';
    return participants.find(p => p.id === id)?.name || 'Desconocido';
  };

  const getGroupName = (id: string | null) => {
    if (!id) return 'Sin grupo';
    return groups.find(g => g.id === id)?.name || 'Grupo Desconocido';
  };

  const selectedGroup = formData.groupId ? groups.find(g => g.id === formData.groupId) : null;
  const filteredParticipants = selectedGroup 
    ? participants.filter(p => selectedGroup.participantsIds.includes(p.id))
    : participants;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Gestión de Partidos / VS</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Crea, edita y elimina los enfrentamientos del torneo.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors"
        >
          <Plus size={16} /> Agregar Partido
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map(m => (
          <div key={m.id} className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl p-5 shadow-md hover:shadow-lg hover:border-[var(--color-chec-cyan)]/40 transition-all">
            
            <div className="flex justify-between items-center mb-4 border-b border-[var(--color-surface)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[var(--color-chec-cyan)] uppercase tracking-wider bg-[var(--color-chec-cyan)]/10 px-2.5 py-1 rounded-md border border-[var(--color-chec-cyan)]/20">
                  {m.round === 'Fase de grupos' ? getGroupName(m.groupId) : m.round}
                </span>
              </div>
              <div className="flex gap-3 bg-[var(--color-surface)] px-2 py-1 rounded-lg border border-[var(--color-surface-alt)]">
                <button onClick={() => handleOpenModal(m)} className="text-[var(--color-chec-blue)] hover:text-[var(--color-chec-cyan)] transition-colors p-1" title="Editar">
                  <Edit2 size={16} />
                </button>
                <div className="w-px bg-[var(--color-surface-alt)]"></div>
                <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 bg-[var(--color-bg-primary)]/50 p-4 rounded-lg border border-[var(--color-surface)]/50">
              <div className="flex-1 text-right pr-4 min-w-0">
                <p className="text-sm md:text-base font-bold text-[var(--color-text-primary)] break-words leading-tight" title={getParticipantName(m.playerAId)}>
                  {getParticipantName(m.playerAId)}
                </p>
                {m.teamA && <p className="text-xs text-[var(--color-text-secondary)] mt-1">{m.teamA}</p>}
              </div>
              <div className="flex-shrink-0 flex items-center justify-center bg-[var(--color-surface)] px-4 py-2 rounded-lg border border-[var(--color-surface-alt)] shadow-inner min-w-[80px]">
                <span className="text-xl font-black text-[var(--color-gamebox-neon)] tracking-widest">
                  {m.scoreA !== null ? m.scoreA : '-'} : {m.scoreB !== null ? m.scoreB : '-'}
                </span>
              </div>
              <div className="flex-1 text-left pl-4 min-w-0">
                <p className="text-sm md:text-base font-bold text-[var(--color-text-primary)] break-words leading-tight" title={getParticipantName(m.playerBId)}>
                  {getParticipantName(m.playerBId)}
                </p>
                {m.teamB && <p className="text-xs text-[var(--color-text-secondary)] mt-1">{m.teamB}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs mt-2 pt-3 border-t border-[var(--color-surface)]/50">
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)] font-medium bg-[var(--color-surface)] px-3 py-1.5 rounded-md">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[var(--color-gamebox-green)]" /> {m.date || 'Sin fecha'}</span>
                <div className="w-1 h-1 rounded-full bg-[var(--color-surface-alt)]"></div>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-[var(--color-gamebox-green)]" /> {m.time || '--:--'}</span>
              </div>
              <span className={`px-3 py-1 rounded-md font-bold text-[11px] uppercase tracking-wider ${
                m.status === 'Pendiente' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                m.status === 'Finalizado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                m.status === 'W.O.' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {m.status}
              </span>
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] rounded-xl border border-dashed border-[var(--color-surface)]">
            No hay partidos creados en el torneo.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg-primary)] rounded-xl w-full max-w-3xl shadow-2xl border border-[var(--color-surface-alt)] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[var(--color-surface)] flex justify-between items-center bg-[var(--color-surface-alt)] rounded-t-xl">
              <h4 className="font-bold text-[var(--color-text-primary)]">
                {editingId ? 'Editar Partido' : 'Nuevo Partido'}
              </h4>
              <button onClick={handleCloseModal} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Ronda / Etapa</label>
                  <select 
                    value={formData.round || ''} 
                    onChange={e => setFormData({...formData, round: e.target.value as MatchRound})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {MATCH_ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Grupo (Opcional)</label>
                  <select 
                    value={formData.groupId || ''} 
                    onChange={e => setFormData({...formData, groupId: e.target.value || null})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    <option value="">-- Sin Grupo --</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Estado</label>
                  <select 
                    value={formData.status || ''} 
                    onChange={e => setFormData({...formData, status: e.target.value as MatchStatus})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {MATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl p-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* Player A */}
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 text-center">Jugador A</label>
                    <select 
                      value={formData.playerAId || ''} 
                      onChange={e => setFormData({...formData, playerAId: e.target.value || null})}
                      className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    >
                      <option value="">-- Por definir --</option>
                      {filteredParticipants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <div className="mt-2">
                      <input 
                        type="text" 
                        value={formData.teamA || ''} 
                        onChange={e => setFormData({...formData, teamA: e.target.value})}
                        className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] text-[var(--color-text-primary)] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-gamebox-green)]"
                        placeholder="Equipo / País"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <input 
                        type="number" min="0" max="99"
                        value={formData.scoreA === null ? '' : formData.scoreA}
                        onChange={(e) => setFormData({...formData, scoreA: e.target.value === '' ? null : parseInt(e.target.value, 10)})}
                        className="w-16 bg-[var(--color-bg-primary)] border border-[var(--color-surface)] text-[var(--color-text-primary)] text-center text-xl rounded-lg px-2 py-2 font-bold focus:outline-none focus:border-[var(--color-gamebox-green)]"
                        placeholder="-"
                      />
                    </div>
                  </div>

                  <div className="text-2xl font-black text-[var(--color-text-secondary)] italic px-4">VS</div>

                  {/* Player B */}
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 text-center">Jugador B</label>
                    <select 
                      value={formData.playerBId || ''} 
                      onChange={e => setFormData({...formData, playerBId: e.target.value || null})}
                      className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    >
                      <option value="">-- Por definir --</option>
                      {filteredParticipants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <div className="mt-2">
                      <input 
                        type="text" 
                        value={formData.teamB || ''} 
                        onChange={e => setFormData({...formData, teamB: e.target.value})}
                        className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] text-[var(--color-text-primary)] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-gamebox-green)]"
                        placeholder="Equipo / País"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <input 
                        type="number" min="0" max="99"
                        value={formData.scoreB === null ? '' : formData.scoreB}
                        onChange={(e) => setFormData({...formData, scoreB: e.target.value === '' ? null : parseInt(e.target.value, 10)})}
                        className="w-16 bg-[var(--color-bg-primary)] border border-[var(--color-surface)] text-[var(--color-text-primary)] text-center text-xl rounded-lg px-2 py-2 font-bold focus:outline-none focus:border-[var(--color-gamebox-green)]"
                        placeholder="-"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Fecha</label>
                  <input 
                    type="date" 
                    value={formData.date || ''} 
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Hora</label>
                  <input 
                    type="time" 
                    value={formData.time || ''} 
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Plataforma</label>
                  <select 
                    value={formData.platform || ''} 
                    onChange={e => setFormData({...formData, platform: e.target.value as PlatformType})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Evidencia</label>
                  <select 
                    value={formData.evidence || ''} 
                    onChange={e => setFormData({...formData, evidence: e.target.value as EvidenceStatus})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {EVIDENCE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-[var(--color-surface)] flex justify-end gap-3 bg-[var(--color-surface-alt)] rounded-b-xl">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors"
              >
                <Save size={16} /> Guardar Partido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
