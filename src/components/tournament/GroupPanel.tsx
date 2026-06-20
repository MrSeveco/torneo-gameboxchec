import { useState } from 'react';
import type { TournamentGroup, Match, Participant } from '../../types/tournament';
import MatchCard from './MatchCard';

interface GroupPanelProps {
  groups: TournamentGroup[];
  matches: Match[];
  participants: Participant[];
  isAdmin?: boolean;
  onUpdateMatch?: (matchId: string, updates: Partial<Match>) => void;
}

export default function GroupPanel({ groups, matches, participants, isAdmin = false, onUpdateMatch }: GroupPanelProps) {
  const [activeTab, setActiveTab] = useState(groups[0]?.id || '');

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[var(--color-surface-alt)] no-scrollbar mb-6">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveTab(group.id)}
            className={`whitespace-nowrap py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === group.id
                ? 'border-[var(--color-gamebox-green)] text-[var(--color-gamebox-neon)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-surface-alt)]'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {groups.map((group) => {
          if (group.id !== activeTab) return null;
          
          const groupMatches = matches.filter(m => m.groupId === group.id);

          return (
            <div key={group.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupMatches.length > 0 ? (
                  groupMatches.map(match => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      participants={participants} 
                      isAdmin={isAdmin}
                      onUpdateMatch={onUpdateMatch}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] rounded-xl border border-dashed border-[var(--color-surface)]">
                    No hay partidos programados aún para este grupo. Pendiente de sorteo.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
