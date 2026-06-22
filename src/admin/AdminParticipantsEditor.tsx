import { useState } from 'react';
import { X, Edit2, Trash2, Save, Plus } from 'lucide-react';
import type { Participant, ParticipantType, TechnicalStatus } from '../types/tournament';

interface Props {
  data: ReturnType<typeof import('../hooks/useTournamentData').useTournamentData>;
}

const PARTICIPANT_TYPES: ParticipantType[] = ['Trabajador CHEC', 'Aprendiz SENA', 'Acompañante', 'Comité', 'Otro'];
const TECHNICAL_STATUSES: TechnicalStatus[] = [
  'Listo Consola + Membresía', 'Requiere Consola', 'Requiere Membresía', 'Requiere Consola + Membresía', 'Autónomo', 'Pendiente'
];

export default function AdminParticipantsEditor({ data }: Props) {
  const { participants, updateSection } = data;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Participant>>({});

  const handleOpenModal = (participant?: Participant) => {
    if (participant) {
      setEditingId(participant.id);
      setFormData({ ...participant });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        type: 'Trabajador CHEC',
        groupId: null,
        technicalStatus: 'Pendiente',
        consoleAssigned: null,
        membership: null,
        logisticsNotes: '',
        isActive: true
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
    if (!formData.name) return; // Basic validation
    
    let newParticipants = [...participants];
    if (editingId) {
      newParticipants = newParticipants.map(p => p.id === editingId ? { ...p, ...formData } as Participant : p);
    } else {
      const newParticipant: Participant = {
        ...(formData as Participant),
        id: `p-${Date.now()}` // Simple unique ID generator
      };
      newParticipants.push(newParticipant);
    }
    
    updateSection('participants', newParticipants);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este participante?')) {
      updateSection('participants', participants.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Gestión de Participantes</h3>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-surface-alt)] shadow-sm">
        <table className="min-w-full divide-y divide-[var(--color-surface-alt)]">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Estado Técnico</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-primary)] divide-y divide-[var(--color-surface)]">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No hay participantes registrados.
                </td>
              </tr>
            ) : (
              participants.map(p => (
                <tr key={p.id} className="hover:bg-[var(--color-surface-alt)]/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-bold">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{p.type}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      p.technicalStatus.includes('Listo') ? 'bg-green-50 text-green-700 border-green-200' : 
                      p.technicalStatus.includes('Requiere') ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {p.technicalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {p.isActive ? (
                      <span className="text-green-600 font-medium">Activo</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="text-[var(--color-chec-blue)] hover:text-[var(--color-chec-cyan)] transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal / Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg-primary)] rounded-xl w-full max-w-lg shadow-2xl border border-[var(--color-surface-alt)] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[var(--color-surface)] flex justify-between items-center bg-[var(--color-surface-alt)] rounded-t-xl">
              <h4 className="font-bold text-[var(--color-text-primary)]">
                {editingId ? 'Editar Participante' : 'Nuevo Participante'}
              </h4>
              <button onClick={handleCloseModal} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Tipo</label>
                  <select 
                    value={formData.type || ''} 
                    onChange={e => setFormData({...formData, type: e.target.value as ParticipantType})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {PARTICIPANT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Estado Técnico</label>
                  <select 
                    value={formData.technicalStatus || ''} 
                    onChange={e => setFormData({...formData, technicalStatus: e.target.value as TechnicalStatus})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {TECHNICAL_STATUSES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">ID Grupo (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.groupId || ''} 
                    onChange={e => setFormData({...formData, groupId: e.target.value})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    placeholder="Ej. g1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Activo</label>
                  <select 
                    value={formData.isActive ? 'true' : 'false'} 
                    onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    <option value="true">Sí (Activo)</option>
                    <option value="false">No (Inactivo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Notas de Logística</label>
                <textarea 
                  value={formData.logisticsNotes || ''} 
                  onChange={e => setFormData({...formData, logisticsNotes: e.target.value})}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)] resize-none"
                  rows={3}
                  placeholder="Observaciones sobre equipos o disponibilidad..."
                />
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
                <Save size={16} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
