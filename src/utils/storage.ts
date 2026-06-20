export const STORAGE_KEY = 'torneo-gamers-chec-2026-admin-data';

/**
 * Carga los datos del torneo desde localStorage
 */
export function loadTournamentDataFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading data from storage', error);
    return null;
  }
}

/**
 * Guarda los datos completos del torneo en localStorage
 */
export function saveTournamentDataToStorage(data: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data to storage', error);
    return false;
  }
}

/**
 * Limpia los datos guardados en localStorage
 */
export function clearTournamentDataStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Genera y descarga un archivo JSON con los datos proporcionados
 */
export function exportTournamentDataAsJson(data: any) {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  const date = new Date().toISOString().split('T')[0];
  link.download = `torneo-data-${date}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
