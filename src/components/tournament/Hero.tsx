import { Users, Trophy, MonitorUp } from 'lucide-react';
import StatCard from './StatCard';
import type { TournamentConfig, TournamentStats } from '../../types/tournament';

interface HeroProps {
  config: TournamentConfig;
  stats: TournamentStats;
}

export default function Hero({ config, stats }: HeroProps) {
  return (
    <div className="relative bg-transparent overflow-hidden border-b border-[var(--color-surface-alt)]">
      {/* Abstract Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)]/80 to-transparent z-10" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[var(--color-chec-blue)]/5 blur-[100px] rounded-full transform translate-x-1/2 -translate-y-1/4" />
        <div className="absolute left-1/4 bottom-0 w-1/3 h-1/2 bg-[var(--color-gamebox-green)]/5 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-[var(--color-chec-cyan)]/10 text-[var(--color-chec-cyan)] text-sm font-bold tracking-wider mb-6 border border-[var(--color-chec-cyan)]/20 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[var(--color-chec-cyan)]" />
            E-SPORTS CHEC
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-[var(--color-text-primary)] leading-tight mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gamebox-green)] to-[var(--color-chec-cyan)] filter shadow-sm">
              {config.name}
            </span>
            <br />
            {config.heroText}
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            {config.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {config.heroChips.map((chip, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-[var(--color-surface-alt)] border border-[var(--color-surface)] px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-primary)] shadow-md">
                <span className="text-[var(--color-gamebox-neon)]">✦</span> {chip}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto text-left">
            <StatCard label="Inscritos" value={stats.totalEnrolled} icon={<Users size={20} />} />
            <StatCard label="Titulares" value={stats.starters} icon={<Trophy size={20} />} />
            <StatCard label="Acompañantes" value={stats.companions} icon={<Users size={20} />} />
            <StatCard label="Consolas Comité" value={stats.committeeConsoles} icon={<MonitorUp size={20} />} />
          </div>

        </div>
      </div>
    </div>
  );
}
