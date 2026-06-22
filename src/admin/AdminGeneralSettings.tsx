
interface Props {
  data: ReturnType<typeof import('../hooks/useTournamentData').useTournamentData>;
}

export default function AdminGeneralSettings({ data }: Props) {
  const { config, updateSection } = data;

  const handleChange = (field: keyof typeof config, value: any) => {
    updateSection('config', { ...config, [field]: value });
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Configuración General</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Nombre del Torneo</label>
            <input 
              type="text" 
              value={config.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-chec-cyan)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Subtítulo</label>
            <input 
              type="text" 
              value={config.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-chec-cyan)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Juegos Oficiales</label>
            <input 
              type="text" 
              value={config.games}
              onChange={(e) => handleChange('games', e.target.value)}
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-chec-cyan)] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Estado del Torneo</label>
            <select 
              value={config.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-surface)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-chec-cyan)] focus:outline-none"
            >
              <option value="Planeación">Planeación</option>
              <option value="Programado">Programado</option>
              <option value="En curso">En curso</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
            <label className="flex items-center gap-2 text-sm font-bold text-red-400 cursor-pointer">
              <input 
                type="checkbox"
                checked={!!config.isPostponed}
                onChange={(e) => handleChange('isPostponed', e.target.checked)}
                className="rounded border-red-500/50 text-red-500 focus:ring-red-500 bg-black/50"
              />
              Activar Alerta de "Torneo Aplazado"
            </label>
            <p className="text-xs text-red-400/80 mt-1 ml-6">
              Muestra un mensaje global a todos los visitantes.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Secciones Visibles al Público</label>
            <div className="space-y-2 bg-[var(--color-bg-primary)] border border-[var(--color-surface)] p-3 rounded-lg">
              {Object.entries(config.visibleSections).map(([key, isVisible]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] capitalize cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => {
                      handleChange('visibleSections', {
                        ...config.visibleSections,
                        [key]: e.target.checked
                      });
                    }}
                    className="rounded border-[var(--color-surface)] text-[var(--color-gamebox-green)] focus:ring-[var(--color-gamebox-green)] bg-black/50"
                  />
                  {key}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
