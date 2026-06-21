import { useState, useMemo, useEffect } from 'react';
import type { ScheduleItem, Match, Participant, TournamentGroup, ScheduleItemStatus } from '../../types/tournament';
import { Clock, Monitor, AlertCircle } from 'lucide-react';

interface ScheduleProps {
  schedule: ScheduleItem[];
  matches?: Match[];
  participants?: Participant[];
  groups?: TournamentGroup[];
}

export default function Schedule({ schedule, matches = [], participants = [], groups = [] }: ScheduleProps) {
  const allScheduleItems = useMemo(() => {
    const combined = [...schedule];
    
    matches.forEach(match => {
      // Solo partidos programados
      if (!match.date || !match.time) return;
      
      const pA = participants.find(p => p.id === match.playerAId);
      const pB = participants.find(p => p.id === match.playerBId);
      const pAName = pA ? pA.name : 'Por definir';
      const pBName = pB ? pB.name : 'Por definir';
      
      const group = groups.find(g => g.id === match.groupId);
      const groupName = group ? group.name : match.round;
      
      let mappedStatus: ScheduleItemStatus = 'Pendiente';
      if (match.status === 'Finalizado' || match.status === 'W.O.') mappedStatus = 'Finalizado';
      
      let formattedDate = match.date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(match.date)) {
        const [, month, day] = match.date.split('-');
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        formattedDate = `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]}`;
      }
      
      combined.push({
        id: `match-${match.id}`,
        date: formattedDate,
        time: match.time,
        title: `${pAName} VS ${pBName}`,
        type: 'Partido',
        status: mappedStatus,
        logistics: '',
        notes: `${groupName} | Consola: ${match.platform}`
      });
    });
    
    // Ordenar cronológicamente
    return combined.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  }, [schedule, matches, participants, groups]);

  const dates = useMemo(() => Array.from(new Set(allScheduleItems.map(s => s.date))), [allScheduleItems]);
  const [activeDate, setActiveDate] = useState(dates[0] || '');

  useEffect(() => {
    if (dates.length > 0 && (!activeDate || !dates.includes(activeDate))) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Listo Consola + Membresía':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold border border-green-200">Listo</span>;
      case 'Requiere Consola + Membresía':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold border border-red-200">Requiere Consola + Membresía</span>;
      case 'Tiene Consola / NO Membresía':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold border border-yellow-300">Requiere Membresía</span>;
      case 'Tiene Membresía / Requiere Consola':
        return <span className="px-2 py-1 bg-blue-100 text-[var(--color-chec-blue)] rounded text-xs font-semibold border border-blue-200">Requiere Consola</span>;
      case 'Comité':
        return <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold border border-indigo-200">Logística Comité</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold border border-gray-200">{status}</span>;
    }
  };

  const filteredSchedule = allScheduleItems.filter(s => s.date === activeDate);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6">
        {dates.map(date => (
          <button
            key={date}
            onClick={() => setActiveDate(date)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeDate === date
                ? 'bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] shadow-[0_0_10px_rgba(132,199,42,0.3)]'
                : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] border border-[var(--color-surface)]'
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl overflow-hidden">
        <div className="divide-y divide-[var(--color-surface)]">
          {filteredSchedule.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 hover:bg-[var(--color-surface)] transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="sm:w-32 flex-shrink-0 flex items-center gap-2 text-[var(--color-gamebox-neon)] font-bold">
                <Clock size={16} />
                {item.time}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <div className="font-bold text-[var(--color-text-primary)] mb-1">{item.title}</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-[var(--color-bg-primary)] rounded text-xs font-medium text-[var(--color-chec-cyan)] border border-[var(--color-surface-alt)]">
                        {item.type}
                      </span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center mt-3">
                  {getStatusBadge(item.status)}
                  
                  {item.notes && (
                    <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                      <Monitor size={14} className="text-[var(--color-chec-cyan)]" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800 shadow-sm">
        <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
        <p>Los participantes deben presentarse mínimo 10 minutos antes de su horario programado. La espera máxima es de 5 minutos, de lo contrario se aplicará W.O.</p>
      </div>
    </div>
  );
}
