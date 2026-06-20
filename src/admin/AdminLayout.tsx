import { useState } from 'react';
import { 
  Settings, BarChart2, Users, LayoutGrid, Swords, Trophy, 
  ListOrdered, Medal, GitMerge, Calendar, Package, BookOpen, 
  Type, Palette, Menu, X, ArrowLeft 
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onExit: () => void;
}

export const ADMIN_TABS = [
  { id: 'general', label: 'Config. General', icon: Settings },
  { id: 'stats', label: 'Estadísticas', icon: BarChart2 },
  { id: 'participants', label: 'Participantes', icon: Users },
  { id: 'groups', label: 'Grupos', icon: LayoutGrid },
  { id: 'matches', label: 'Partidos / VS', icon: Swords },
  { id: 'results', label: 'Resultados', icon: Trophy },
  { id: 'standings', label: 'Tabla Posiciones', icon: ListOrdered },
  { id: 'qualified', label: 'Clasificados', icon: Medal },
  { id: 'bracket', label: 'Bracket', icon: GitMerge },
  { id: 'schedule', label: 'Cronograma', icon: Calendar },
  { id: 'logistics', label: 'Logística', icon: Package },
  { id: 'rules', label: 'Reglamento', icon: BookOpen },
  { id: 'content', label: 'Textos Landing', icon: Type },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
];

export default function AdminLayout({ children, activeTab, onTabChange, onExit }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[var(--color-bg-primary)] overflow-hidden border-t border-[var(--color-surface-alt)]">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface-alt)] border-r border-[var(--color-surface)]
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col h-full
      `}>
        <div className="p-4 border-b border-[var(--color-surface)] flex justify-between items-center bg-[var(--color-surface-alt)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            CMS Panel
          </h2>
          <button 
            className="md:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1 px-2">
            {ADMIN_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-[var(--color-gamebox-green)]/10 text-[var(--color-gamebox-neon)] border border-[var(--color-gamebox-green)]/30' 
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--color-surface)]">
          <button 
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] rounded-lg transition-colors border border-[var(--color-surface-alt)]"
          >
            <ArrowLeft size={16} /> Vista Pública
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden flex items-center px-4 h-14 bg-[var(--color-surface-alt)] border-b border-[var(--color-surface)]">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-[var(--color-text-primary)]">
            {ADMIN_TABS.find(t => t.id === activeTab)?.label}
          </span>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
