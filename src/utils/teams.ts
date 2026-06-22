export const getTeamInfo = (teamName: string | undefined | null) => {
  if (!teamName) return null;
  
  const name = teamName.trim().toLowerCase();
  
  // Mapping of common countries (in Spanish) to ISO 2-letter code for flags and 3-letter FIFA code
  const map: Record<string, { code: string, abbr: string }> = {
    'argentina': { code: 'ar', abbr: 'ARG' },
    'brasil': { code: 'br', abbr: 'BRA' },
    'colombia': { code: 'co', abbr: 'COL' },
    'francia': { code: 'fr', abbr: 'FRA' },
    'españa': { code: 'es', abbr: 'ESP' },
    'inglaterra': { code: 'gb-eng', abbr: 'ENG' },
    'alemania': { code: 'de', abbr: 'GER' },
    'portugal': { code: 'pt', abbr: 'POR' },
    'italia': { code: 'it', abbr: 'ITA' },
    'países bajos': { code: 'nl', abbr: 'NED' },
    'holanda': { code: 'nl', abbr: 'NED' },
    'uruguay': { code: 'uy', abbr: 'URU' },
    'bélgica': { code: 'be', abbr: 'BEL' },
    'belgica': { code: 'be', abbr: 'BEL' },
    'croacia': { code: 'hr', abbr: 'CRO' },
    'méxico': { code: 'mx', abbr: 'MEX' },
    'mexico': { code: 'mx', abbr: 'MEX' },
    'ecuador': { code: 'ec', abbr: 'ECU' },
    'chile': { code: 'cl', abbr: 'CHI' },
    'perú': { code: 'pe', abbr: 'PER' },
    'peru': { code: 'pe', abbr: 'PER' },
    'marruecos': { code: 'ma', abbr: 'MAR' },
    'estados unidos': { code: 'us', abbr: 'USA' },
    'usa': { code: 'us', abbr: 'USA' },
    'japón': { code: 'jp', abbr: 'JPN' },
    'japon': { code: 'jp', abbr: 'JPN' },
    'corea del sur': { code: 'kr', abbr: 'KOR' }
  };

  const info = map[name];
  
  if (info) {
    return {
      name: teamName,
      abbr: info.abbr,
      flagUrl: `https://flagcdn.com/w40/${info.code}.png`
    };
  }
  
  // Fallback for unknown teams (e.g. clubs or typos)
  return {
    name: teamName,
    abbr: teamName.substring(0, 3).toUpperCase(),
    flagUrl: null
  };
};
