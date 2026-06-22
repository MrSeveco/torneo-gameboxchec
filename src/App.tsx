import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/tournament/Hero';
import SectionTitle from './components/layout/SectionTitle';
import GroupPanel from './components/tournament/GroupPanel';
import ResultsTable from './components/tournament/ResultsTable';
import StandingsTable from './components/tournament/StandingsTable';
import Schedule from './components/tournament/Schedule';
import RulesQuickView from './components/tournament/RulesQuickView';
import Bracket from './components/tournament/Bracket';

import AdminLogin from './auth/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { isAdminSessionActive, logoutAdmin } from './auth/adminAuth';
import { useTournamentData } from './hooks/useTournamentData';
import bgImage from './assets/background.png';

function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showPostponedModal, setShowPostponedModal] = useState(false);

  const {
    config,
    stats,
    matches,
    groups,
    participants,
    schedule,
    rules,
    bracketRounds,
    hasUnsavedChanges,
    updateMatch
  } = useTournamentData();

  useEffect(() => {
    if (config.isPostponed) {
      setShowPostponedModal(true);
    } else {
      setShowPostponedModal(false);
    }
  }, [config.isPostponed]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
        setIsAdminAuth(isAdminSessionActive());
      } else {
        setCurrentView('public');
      }
    };

    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAdminSuccess = () => {
    setIsAdminAuth(true);
  };

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('Hay cambios sin guardar. ¿Seguro que quieres salir?')) return;
    }
    logoutAdmin();
    setIsAdminAuth(false);
    window.location.hash = '#home';
  };

  const renderPublicView = () => (
    <main id="inicio">
      <Hero config={config} stats={stats} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 py-16">
        <section id="grupos" className="scroll-mt-24">
          <SectionTitle title="Grupos y Enfrentamientos" subtitle="Fase de grupos. Partidos programados y pendientes." />
          <GroupPanel
            groups={groups}
            matches={matches}
            participants={participants}
            isAdmin={false}
            onUpdateMatch={updateMatch}
          />
        </section>

        <section id="resultados" className="scroll-mt-24">
          <SectionTitle title="Tabla de Resultados" subtitle="Resultados oficiales reportados con evidencia." />
          <ResultsTable
            matches={matches}
            participants={participants}
            groups={groups}
            isAdmin={false}
            onUpdateMatch={updateMatch}
          />
        </section>

        <section id="clasificados" className="scroll-mt-24">
          <SectionTitle title="Posiciones y Clasificados" subtitle="Clasificación actual por grupo y camino a la final." />
          <StandingsTable groups={groups} matches={matches} participants={participants} />

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 text-center md:text-left">Camino a la Final</h3>
            <div className="bg-[var(--color-bg-alt)] border border-[var(--color-surface-alt)] rounded-xl p-6 overflow-hidden">
              <Bracket bracketRounds={bracketRounds} participants={participants} />
            </div>
          </div>
        </section>

        <section id="cronograma" className="scroll-mt-24">
          <SectionTitle title="Cronograma Oficial" subtitle="Horarios, logística y asignación de consolas." />
          <Schedule schedule={schedule} matches={matches} participants={participants} groups={groups} />
        </section>

        <section id="reglamento" className="scroll-mt-24">
          <SectionTitle title="Reglamento Técnico" subtitle="Normas rápidas para los participantes." />
          <RulesQuickView rules={rules} />
        </section>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen relative text-[var(--color-text-primary)] flex flex-col">
      {/* Base Color Layer */}
      <div className="fixed inset-0 z-[-2] bg-[var(--color-bg-primary)]" />

      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Modal de Torneo Aplazado */}
      {showPostponedModal && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-primary)] rounded-xl w-full max-w-md shadow-2xl border border-red-500/50 flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
            
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-3 uppercase tracking-wide">
                Torneo Aplazado
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 text-sm md:text-base leading-relaxed">
                Por novedades logísticas, el evento ha sido <strong className="text-red-400">aplazado hasta nuevo aviso</strong>. 
                Pronto estaremos publicando las nuevas fechas a través de los canales oficiales.
              </p>
              
              <button 
                onClick={() => {
                  setShowPostponedModal(false);
                  if (config.isPostponed) {
                    setTimeout(() => setShowPostponedModal(true), 3000);
                  }
                }}
                className="w-full py-3 bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-lg font-bold text-sm border border-[var(--color-surface)] hover:border-[var(--color-chec-cyan)]/50 transition-all uppercase tracking-wider"
              >
                Entendido, ver sitio
              </button>
            </div>
          </div>
        </div>
      )}
      <Header
        isAdmin={isAdminAuth && currentView === 'admin'}
        onLogout={handleLogout}
      />

      {currentView === 'admin' ? (
        isAdminAuth ? (
          <div className="h-screen w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-[112px] pb-8 z-10 relative flex flex-col min-h-0">
            <AdminDashboard onExit={handleLogout} />
          </div>
        ) : (
          <div className="flex-1 z-10 relative flex items-center justify-center pt-20">
            <AdminLogin onSuccess={handleAdminSuccess} onCancel={() => window.location.hash = '#home'} />
          </div>
        )
      ) : (
        <div className="flex-1">
          {renderPublicView()}
        </div>
      )}

      {currentView !== 'admin' && <Footer />}
    </div>
  );
}

export default App;
