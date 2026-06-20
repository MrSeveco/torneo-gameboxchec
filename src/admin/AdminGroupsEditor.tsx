import { useState } from 'react';
import { X, Edit2, Trash2, Save, Plus, Users } from 'lucide-react';
import type { TournamentGroup, GroupStatus } from '../types/tournament';

interface Props {
  data: ReturnType<typeof import('../hooks/useTournamentData').useTournamentData>;
}

const GROUP_STATUSES: GroupStatus[] = ['Pendiente de sorteo', 'Programado', 'En curso', 'Finalizado'];

export default function AdminGroupsEditor({ data }: Props) {
  const { groups, participants, updateSection } = data;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TournamentGroup>>({});

  const handleOpenModal = (group?: TournamentGroup) => {
    if (group) {
      setEditingId(group.id);
      setFormData({ ...group });
    } else {
      setEditingId(null);
      setFormData({
        name: `Grupo ${String.fromCharCode(65 + groups.length)}`, // Auto A, B, C...
        description: '',
        participantsIds: [],
        qualifiedCount: 2,
        status: 'Pendiente de sorteo',
        order: groups.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const toggleParticipant = (participantId: string) => {
    const currentIds = formData.participantsIds || [];
    if (currentIds.includes(participantId)) {
      setFormData({ ...formData, participantsIds: currentIds.filter(id => id !== participantId) });
    } else {
      setFormData({ ...formData, participantsIds: [...currentIds, participantId] });
    }
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    let newGroups = [...groups];
    if (editingId) {
      newGroups = newGroups.map(g => g.id === editingId ? { ...g, ...formData } as TournamentGroup : g);
    } else {
      const newGroup: TournamentGroup = {
        ...(formData as TournamentGroup),
        id: `g${Date.now()}`
      };
      newGroups.push(newGroup);
    }
    
    updateSection('groups', newGroups);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este grupo? Los partidos asociados podrían perder su referencia.')) {
      updateSection('groups', groups.filter(g => g.id !== id));
    }
  };

  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || 'Desconocido';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Gestión de Grupos</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Crea grupos y asigna a los participantes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors"
        >
          <Plus size={16} /> Crear Grupo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(g => (
          <div key={g.id} className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-[var(--color-text-primary)]">{g.name}</h4>
                <span className="text-xs text-[var(--color-text-secondary)]">{g.status}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(g)} className="text-[var(--color-chec-blue)] hover:text-[var(--color-chec-cyan)]" title="Editar">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-600" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-2 font-semibold">
                <Users size={14} /> Participantes ({g.participantsIds.length})
              </div>
              <ul className="text-sm space-y-1">
                {g.participantsIds.length > 0 ? (
                  g.participantsIds.map(pid => (
                    <li key={pid} className="truncate text-[var(--color-text-primary)]">• {getParticipantName(pid)}</li>
                  ))
                ) : (
                  <li className="text-[var(--color-text-secondary)] italic">Ninguno asignado</li>
                )}
              </ul>
            </div>
            
            <div className="text-xs text-[var(--color-gamebox-neon)] bg-[var(--color-bg-primary)] px-2 py-1 rounded inline-block border border-[var(--color-surface)]">
              Clasifican: {g.qualifiedCount}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg-primary)] rounded-xl w-full max-w-2xl shadow-2xl border border-[var(--color-surface-alt)] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[var(--color-surface)] flex justify-between items-center bg-[var(--color-surface-alt)] rounded-t-xl">
              <h4 className="font-bold text-[var(--color-text-primary)]">
                {editingId ? 'Editar Grupo' : 'Nuevo Grupo'}
              </h4>
              <button onClick={handleCloseModal} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Columna Izquierda: Datos Básicos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Nombre del Grupo</label>
                  <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    placeholder="Ej. Grupo A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Estado</label>
                  <select 
                    value={formData.status || ''} 
                    onChange={e => setFormData({...formData, status: e.target.value as GroupStatus})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {GROUP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Cupos Clasificación</label>
                    <input 
                      type="number" min="1"
                      value={formData.qualifiedCount || 2} 
                      onChange={e => setFormData({...formData, qualifiedCount: parseInt(e.target.value, 10)})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Orden (Posición)</label>
                    <input 
                      type="number" min="1"
                      value={formData.order || 1} 
                      onChange={e => setFormData({...formData, order: parseInt(e.target.value, 10)})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Participantes */}
              <div className="border border-[var(--color-surface)] rounded-lg flex flex-col h-full bg-[var(--color-surface-alt)]">
                <div className="p-3 border-b border-[var(--color-surface)] bg-[var(--color-surface-alt)] rounded-t-lg">
                  <label className="text-sm font-bold text-[var(--color-text-primary)]">
                    Asignar Participantes ({formData.participantsIds?.length || 0})
                  </label>
                </div>
                <div className="p-2 overflow-y-auto max-h-[300px] flex-1">
                  {participants.map(p => (
                    <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-[var(--color-surface)] rounded cursor-pointer transition-colors">
                      <input 
                        type="checkbox"
                        checked={formData.participantsIds?.includes(p.id) || false}
                        onChange={() => toggleParticipant(p.id)}
                        className="w-4 h-4 rounded text-[var(--color-gamebox-green)] focus:ring-[var(--color-gamebox-green)] bg-black/50 border-[var(--color-surface)]"
                      />
                      <span className="text-sm text-[var(--color-text-primary)] truncate">{p.name}</span>
                    </label>
                  ))}
                  {participants.length === 0 && (
                    <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">No hay participantes registrados.</p>
                  )}
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
                disabled={!formData.name}
                className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors disabled:opacity-50"
              >
                <Save size={16} /> Guardar Grupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
