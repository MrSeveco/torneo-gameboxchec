interface Props {
  data: ReturnType<typeof import('../hooks/useTournamentData').useTournamentData>;
}

export default function AdminStatsEditor({ data }: Props) {
  const { stats, updateSection, participants, groups, matches } = data;

  const handleChange = (field: keyof typeof stats, value: any) => {
    updateSection('stats', { ...stats, [field]: value });
  };

  const autoCalculatedStats = {
    totalEnrolled: participants.length,
    groupCount: groups.length,
    scheduledMatches: matches.length,
    playedMatches: matches.filter(m => m.status === 'Finalizado' || m.status === 'W.O.').length,
    qualifiedCount: groups.reduce((acc, g) => acc + g.qualifiedCount, 0)
  };

  const handleToggleMode = () => {
    const newMode = !stats.useAutoStats;
    if (newMode) {
      // Switch to auto, overwrite manual with auto calculated
      updateSection('stats', {
        ...stats,
        useAutoStats: true,
        ...autoCalculatedStats
      });
    } else {
      updateSection('stats', { ...stats, useAutoStats: false });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Estadísticas del Torneo</h3>
        
        <label className="flex items-center gap-2 cursor-pointer bg-[var(--color-surface)] px-4 py-2 rounded-lg border border-[var(--color-surface-alt)]">
          <input 
            type="checkbox" 
            checked={stats.useAutoStats}
            onChange={handleToggleMode}
            className="rounded border-[var(--color-surface)] text-[var(--color-gamebox-green)] focus:ring-[var(--color-gamebox-green)] bg-black/50"
          />
          <span className="text-sm font-medium text-[var(--color-text-primary)]">Usar estadísticas automáticas</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatInput label="Total Inscritos" value={stats.totalEnrolled} onChange={(v) => handleChange('totalEnrolled', v)} disabled={stats.useAutoStats} />
        <StatInput label="Titulares" value={stats.starters} onChange={(v) => handleChange('starters', v)} disabled={false} />
        <StatInput label="Acompañantes" value={stats.companions} onChange={(v) => handleChange('companions', v)} disabled={false} />
        <StatInput label="Consolas Comité" value={stats.committeeConsoles} onChange={(v) => handleChange('committeeConsoles', v)} disabled={false} />
        <StatInput label="Requieren Apoyo" value={stats.needsSupport} onChange={(v) => handleChange('needsSupport', v)} disabled={false} />
        <StatInput label="En Condiciones" value={stats.inConditions} onChange={(v) => handleChange('inConditions', v)} disabled={false} />
        <StatInput label="Cantidad de Grupos" value={stats.groupCount} onChange={(v) => handleChange('groupCount', v)} disabled={stats.useAutoStats} />
        <StatInput label="Partidos Programados" value={stats.scheduledMatches} onChange={(v) => handleChange('scheduledMatches', v)} disabled={stats.useAutoStats} />
        <StatInput label="Partidos Jugados" value={stats.playedMatches} onChange={(v) => handleChange('playedMatches', v)} disabled={stats.useAutoStats} />
        <StatInput label="Clasificados Finales" value={stats.qualifiedCount} onChange={(v) => handleChange('qualifiedCount', v)} disabled={stats.useAutoStats} />
      </div>
    </div>
  );
}

function StatInput({ label, value, onChange, disabled }: { label: string, value: number, onChange: (val: number) => void, disabled: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${disabled ? 'bg-black/30 border-black/50 opacity-70' : 'bg-[var(--color-bg-primary)] border-[var(--color-surface)]'}`}>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">{label}</label>
      <input 
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        disabled={disabled}
        className="w-full bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded text-[var(--color-text-primary)] px-3 py-1.5 focus:border-[var(--color-chec-cyan)] focus:outline-none disabled:bg-transparent disabled:border-none disabled:px-0 disabled:font-bold disabled:text-lg"
      />
    </div>
  );
}
