import { useState } from 'react';
import { Save, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import DataImportExport from './DataImportExport';
import { useTournamentData } from '../hooks/useTournamentData';

// Pestañas (Editores) a construir
import AdminGeneralSettings from './AdminGeneralSettings';
import AdminStatsEditor from './AdminStatsEditor';
import AdminParticipantsEditor from './AdminParticipantsEditor';
import AdminGroupsEditor from './AdminGroupsEditor';
import AdminBracketEditor from './AdminBracketEditor';
import AdminMatchesEditor from './AdminMatchesEditor';
import AdminScheduleEditor from './AdminScheduleEditor';
import ResultsTable from '../components/tournament/ResultsTable';

export default function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [activeTab, setActiveTab] = useState('general');
  
  const tournamentData = useTournamentData();
  const { 
    hasUnsavedChanges, 
    hasLocalData, 
    saveChanges, 
    resetChanges, 
    exportJson, 
    importJson 
  } = tournamentData;

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar los datos originales? Se perderán todos los cambios locales.')) {
      resetChanges();
    }
  };

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'general':
        return <AdminGeneralSettings data={tournamentData} />;
      case 'stats':
        return <AdminStatsEditor data={tournamentData} />;
      case 'participants':
        return <AdminParticipantsEditor data={tournamentData} />;
      case 'groups':
        return <AdminGroupsEditor data={tournamentData} />;
      case 'bracket':
        return <AdminBracketEditor data={tournamentData} />;
      case 'matches':
        return <AdminMatchesEditor data={tournamentData} />;
      case 'schedule':
        return <AdminScheduleEditor data={tournamentData} />;
      case 'results':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Gestión Rápida de Resultados</h3>
            <ResultsTable 
              groups={tournamentData.groups} 
              matches={tournamentData.matches} 
              participants={tournamentData.participants} 
              isAdmin={true} 
              onUpdateMatch={tournamentData.updateMatch} 
            />
          </div>
        );
      // TODO: Añadir el resto de editores a medida que los vayamos creando
      default:
        return (
          <div className="p-12 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] rounded-xl border border-dashed border-[var(--color-surface)]">
            Editor para "{activeTab}" en construcción...
          </div>
        );
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onExit={onExit}>
      
      {/* Top Action Bar */}
      <div className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 animate-pulse">
              Cambios sin guardar
            </span>
          )}
          {hasLocalData && !hasUnsavedChanges && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
              Datos locales guardados
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={saveChanges}
            disabled={!hasUnsavedChanges}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-gamebox-green)] text-[var(--color-bg-primary)] font-bold rounded-lg hover:bg-[var(--color-gamebox-neon)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} /> Guardar
          </button>
          
          <button
            onClick={exportJson}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-black/30 border border-[var(--color-surface-alt)] transition-colors"
          >
            <Download size={16} /> Exportar
          </button>

          <DataImportExport onImport={importJson} />

          <button
            onClick={handleReset}
            disabled={!hasLocalData && !hasUnsavedChanges}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 font-medium rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={16} /> Restaurar
          </button>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800 mb-8 shadow-sm">
        <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />
        <p>
          <strong className="text-yellow-900">Recordatorio:</strong> Estos datos solo se guardan en tu navegador. Para hacerlos públicos, exporta el JSON y reemplaza los datos del repositorio.
        </p>
      </div>

      {/* Editor Content Area */}
      <div className="bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-xl p-6 min-h-[50vh]">
        {renderActiveEditor()}
      </div>

    </AdminLayout>
  );
}
