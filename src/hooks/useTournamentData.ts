import { useState, useEffect, useCallback } from 'react';
import type { 
  TournamentData, 
  TournamentGroup,
  Match
} from '../types/tournament';
import { initialTournamentData } from '../data/tournamentData';
import { supabase } from '../config/supabaseClient';
import { 
  loadTournamentDataFromStorage, 
  saveTournamentDataToStorage, 
  clearTournamentDataStorage,
  exportTournamentDataAsJson
} from '../utils/storage';

export interface ExtendedTournamentState extends TournamentData {
  hasUnsavedChanges: boolean;
  hasLocalData: boolean;
  isLoading: boolean;
}

export function useTournamentData() {
  const [state, setState] = useState<ExtendedTournamentState>({
    ...initialTournamentData,
    hasUnsavedChanges: false,
    hasLocalData: false,
    isLoading: true
  });

  // Load from Supabase on mount
  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('tournament_state')
          .select('data')
          .eq('id', 1)
          .single();

        if (error) {
          // Supabase might throw an error if the row doesn't exist yet, we can ignore it
          // if it's the PGRST116 (No rows found) error, but let's just log and fallback.
          console.warn('No se pudo cargar de Supabase, usando datos locales/base.', error);
          throw error;
        }

        if (data && data.data && Object.keys(data.data).length > 0) {
          setState(prev => ({
            ...prev,
            ...data.data, 
            hasLocalData: true,
            hasUnsavedChanges: false,
            isLoading: false
          }));
        } else {
          throw new Error("Data empty");
        }
      } catch (err) {
        // Fallback to local storage
        const localData = loadTournamentDataFromStorage();
        if (localData) {
          setState(prev => ({
            ...prev,
            ...localData,
            hasLocalData: true,
            hasUnsavedChanges: false,
            isLoading: false
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchFromSupabase();
  }, []);

  // Universal updater for top level state keys
  const updateSection = useCallback(<K extends keyof TournamentData>(key: K, data: TournamentData[K]) => {
    setState(prev => ({
      ...prev,
      [key]: data,
      hasUnsavedChanges: true
    }));
  }, []);

  // Helper for single match
  const updateMatch = useCallback((matchId: string, updates: Partial<Match>) => {
    setState(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId ? { ...m, ...updates } : m),
      hasUnsavedChanges: true
    }));
  }, []);

  // Helper for single group
  const updateGroup = useCallback((groupId: string, updates: Partial<TournamentGroup>) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? { ...g, ...updates } : g),
      hasUnsavedChanges: true
    }));
  }, []);

  const saveChanges = useCallback(async () => {
    // Extract only the TournamentData part without extended UI state
    const { hasUnsavedChanges, hasLocalData, isLoading, ...dataToSave } = state;
    
    // Save to local storage as backup
    saveTournamentDataToStorage(dataToSave);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('tournament_state')
        .update({ data: dataToSave, updated_at: new Date().toISOString() })
        .eq('id', 1);

      if (error) {
        console.error('Error saving to Supabase:', error);
        alert('Hubo un error al guardar en la nube, pero se guardó localmente. Verifica consola.');
        return false;
      }
      
      setState(prev => ({ ...prev, hasUnsavedChanges: false, hasLocalData: true }));
      return true;
    } catch (err) {
      console.error('Exception saving to Supabase:', err);
      return false;
    }
  }, [state]);

  const resetChanges = useCallback(() => {
    clearTournamentDataStorage();
    setState({
      ...initialTournamentData,
      hasUnsavedChanges: false,
      hasLocalData: false
    });
  }, []);

  const exportJson = useCallback(() => {
    const { hasUnsavedChanges, hasLocalData, ...fullData } = state;
    exportTournamentDataAsJson(fullData);
  }, [state]);

  const importJson = useCallback((file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          // Basic validation to ensure it's a valid TournamentData object
          if (imported.config && imported.participants && imported.matches) {
            setState(prev => ({
              ...prev,
              ...imported,
              hasUnsavedChanges: true
            }));
            resolve(true);
          } else {
            console.error('Invalid JSON structure');
            resolve(false);
          }
        } catch (err) {
          console.error('Error parsing JSON', err);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  return {
    ...state,
    updateSection,
    updateMatch,
    updateGroup,
    saveChanges,
    resetChanges,
    exportJson,
    importJson
  };
}
