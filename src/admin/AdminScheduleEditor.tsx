import { useState } from 'react';
import { X, Edit2, Trash2, Save, Plus, Calendar, Clock, AlignLeft, Info } from 'lucide-react';
import type { ScheduleItem } from '../types/tournament';

interface Props {
  data: ReturnType<typeof import('../hooks/useTournamentData').useTournamentData>;
}

const SCHEDULE_TYPES = ['Partido', 'Logística', 'Reunión', 'Ceremonia', 'Otro'];
const SCHEDULE_STATUSES = ['Pendiente', 'Comité', 'Completado', 'Cancelado', 'Reprogramado'];

export default function AdminScheduleEditor({ data }: Props) {
  const { schedule, updateSection } = data;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({});

  const handleOpenModal = (item?: ScheduleItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ ...item });
    } else {
      setEditingId(null);
      setFormData({
        date: '',
        time: '',
        title: '',
        type: 'Partido',
        status: 'Pendiente',
        logistics: '',
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
    if (!formData.title) return; // Basic validation
    
    let newSchedule = [...schedule];
    if (editingId) {
      newSchedule = newSchedule.map(s => s.id === editingId ? { ...s, ...formData } as ScheduleItem : s);
    } else {
      const newItem: ScheduleItem = {
        ...(formData as ScheduleItem),
        id: `s-${Date.now()}`
      };
      newSchedule.push(newItem);
    }
    
    // Opcional: Podríamos ordenar el arreglo por fecha/hora aquí si quisiéramos
    updateSection('schedule', newSchedule);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este evento del cronograma?')) {
      updateSection('schedule', schedule.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Gestión del Cronograma</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Organiza los horarios, partidos y logística del evento.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors"
        >
          <Plus size={16} /> Agregar Evento
        </button>
      </div>

      <div className="space-y-4">
        {schedule.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] rounded-xl border border-dashed border-[var(--color-surface)]">
            No hay eventos en el cronograma.
          </div>
        ) : (
          schedule.map(item => (
            <div key={item.id} className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl p-4 shadow-sm hover:border-[var(--color-chec-cyan)]/30 transition-colors flex flex-col md:flex-row gap-4 md:items-center">
              
              {/* Fecha y Hora */}
              <div className="flex flex-col items-center justify-center bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg px-4 py-2 min-w-[120px]">
                <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">{item.date || 'Sin fecha'}</span>
                <span className="text-lg font-black text-[var(--color-gamebox-neon)]">{item.time || '--:--'}</span>
              </div>
              
              {/* Contenido Principal */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    item.type === 'Partido' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    item.type === 'Logística' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    {item.type}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    item.status === 'Pendiente' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                    item.status === 'Completado' ? 'bg-[var(--color-gamebox-green)]/10 text-[var(--color-gamebox-green)] border-[var(--color-gamebox-green)]/20' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[var(--color-text-primary)] leading-tight mb-2">{item.title}</h4>
                
                {item.logistics && (
                  <div className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)] mb-1">
                    <Info size={14} className="mt-0.5 flex-shrink-0 text-[var(--color-chec-cyan)]" />
                    <span><strong>Logística:</strong> {item.logistics}</span>
                  </div>
                )}
                {item.notes && (
                  <div className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                    <AlignLeft size={14} className="mt-0.5 flex-shrink-0 text-[var(--color-text-secondary)]" />
                    <span className="line-clamp-2 italic">{item.notes}</span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-row md:flex-col gap-2 justify-end mt-4 md:mt-0 pt-3 md:pt-0 border-t border-[var(--color-surface)] md:border-t-0">
                <button 
                  onClick={() => handleOpenModal(item)} 
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-1.5 bg-[var(--color-surface)] text-[var(--color-chec-blue)] hover:text-[var(--color-chec-cyan)] rounded border border-[var(--color-surface-alt)] hover:border-[var(--color-chec-cyan)]/30 transition-colors"
                >
                  <Edit2 size={14} /> <span className="text-xs md:hidden">Editar</span>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-1.5 bg-[var(--color-surface)] text-red-400 hover:text-red-500 rounded border border-[var(--color-surface-alt)] hover:border-red-500/30 transition-colors"
                >
                  <Trash2 size={14} /> <span className="text-xs md:hidden">Eliminar</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal / Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg-primary)] rounded-xl w-full max-w-2xl shadow-2xl border border-[var(--color-surface-alt)] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[var(--color-surface)] flex justify-between items-center bg-[var(--color-surface-alt)] rounded-t-xl">
              <h4 className="font-bold text-[var(--color-text-primary)]">
                {editingId ? 'Editar Evento' : 'Nuevo Evento'}
              </h4>
              <button onClick={handleCloseModal} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Título / Descripción Principal</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  placeholder="Ej. Jhon Sebastian Lopez Osorio vs..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Fecha</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                    <input 
                      type="date" 
                      value={formData.date || ''} 
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg pl-10 pr-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Hora</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" size={16} />
                    <input 
                      type="time" 
                      value={formData.time || ''} 
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg pl-10 pr-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Tipo de Evento</label>
                  <select 
                    value={formData.type || ''} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {SCHEDULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Estado</label>
                  <select 
                    value={formData.status || ''} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  >
                    {SCHEDULE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Logística (Opcional)</label>
                <input 
                  type="text" 
                  value={formData.logistics || ''} 
                  onChange={e => setFormData({...formData, logistics: e.target.value})}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)]"
                  placeholder="Ej. Consola #1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Notas Adicionales (Opcional)</label>
                <textarea 
                  value={formData.notes || ''} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-alt)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)] resize-none"
                  rows={3}
                  placeholder="Instrucciones especiales, recogidas de equipos..."
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
                disabled={!formData.title}
                className="px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-gamebox-neon)] transition-colors disabled:opacity-50"
              >
                <Save size={16} /> Guardar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
