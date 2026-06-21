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

  const renderPublicView = (isAdmin = false) => (
    <main id="inicio">
      {!isAdmin && <Hero config={config} stats={stats} />}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 ${isAdmin ? 'py-6' : 'py-16'}`}>
        {isAdmin && (
          <AdminDashboard onExit={handleLogout} />
        )}

        <section id="grupos" className="scroll-mt-24">
          <SectionTitle title="Grupos y Enfrentamientos" subtitle="Fase de grupos. Partidos programados y pendientes." />
          <GroupPanel
            groups={groups}
            matches={matches}
            participants={participants}
            isAdmin={isAdmin}
            onUpdateMatch={updateMatch}
          />
        </section>

        <section id="resultados" className="scroll-mt-24">
          <SectionTitle title="Tabla de Resultados" subtitle="Resultados oficiales reportados con evidencia." />
          <ResultsTable
            matches={matches}
            participants={participants}
            groups={groups}
            isAdmin={isAdmin}
            onUpdateMatch={updateMatch}
          />
        </section>

        <section id="clasificados" className="scroll-mt-24">
          <SectionTitle title="Posiciones y Clasificados" subtitle="Clasificación actual por grupo y camino a la final." />
          {isAdmin && (
            <div className="mb-4 text-sm text-[var(--color-chec-blue)] font-medium bg-blue-50 p-3 rounded-lg border border-[var(--color-chec-blue)]/30 shadow-sm">
              Nota: La tabla de clasificación y el bracket no son editables directamente. Se recalculan automáticamente al guardar resultados válidos.
            </div>
          )}
          <StandingsTable groups={groups} matches={matches} participants={participants} />

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 text-center md:text-left">Camino a la Final</h3>
            <div className="bg-[var(--color-bg-alt)] border border-[var(--color-surface-alt)] rounded-xl p-6 overflow-hidden">
              <Bracket bracketRounds={bracketRounds} participants={participants} />
            </div>
          </div>
        </section>

        {!isAdmin && (
          <>
            <section id="cronograma" className="scroll-mt-24">
              <SectionTitle title="Cronograma Oficial" subtitle="Horarios, logística y asignación de consolas." />
              <Schedule schedule={schedule} matches={matches} participants={participants} groups={groups} />
            </section>

            <section id="reglamento" className="scroll-mt-24">
              <SectionTitle title="Reglamento Técnico" subtitle="Normas rápidas para los participantes." />
              <RulesQuickView rules={rules} />
            </section>
          </>
        )}
      </div>
    </main>
  );

  return (
    <div className="min-h-screen relative text-[var(--color-text-primary)] overflow-hidden">
      {/* Base Color Layer */}
      <div className="fixed inset-0 z-[-2] bg-[var(--color-bg-primary)]" />

      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <Header
        isAdmin={isAdminAuth && currentView === 'admin'}
        onLogout={handleLogout}
      />

      <div>
        {currentView === 'admin' ? (
          isAdminAuth ? renderPublicView(true) : <AdminLogin onSuccess={handleAdminSuccess} onCancel={() => window.location.hash = '#home'} />
        ) : (
          renderPublicView(false)
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
