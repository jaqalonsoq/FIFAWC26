import type { Team } from '../types'

export const WC2026_TEAMS: Team[] = [
  // Grupo A
  { id: 1,  name: 'México',        code: 'MEX', flag: '🇲🇽', group: 'A', elo: 1762, avgGoalsFor: 1.4, avgGoalsAgainst: 1.2, avgCorners: 4.8, avgYellowCards: 2.0, avgRedCards: 0.1 },
  { id: 2,  name: 'Ecuador',       code: 'ECU', flag: '🇪🇨', group: 'A', elo: 1680, avgGoalsFor: 1.3, avgGoalsAgainst: 1.3, avgCorners: 4.5, avgYellowCards: 2.0, avgRedCards: 0.1 },
  { id: 3,  name: 'Suiza',         code: 'SUI', flag: '🇨🇭', group: 'A', elo: 1778, avgGoalsFor: 1.5, avgGoalsAgainst: 1.0, avgCorners: 5.0, avgYellowCards: 1.8, avgRedCards: 0.1 },
  { id: 4,  name: 'Honduras',      code: 'HON', flag: '🇭🇳', group: 'A', elo: 1540, avgGoalsFor: 1.0, avgGoalsAgainst: 1.6, avgCorners: 4.0, avgYellowCards: 2.4, avgRedCards: 0.2 },
  // Grupo B
  { id: 5,  name: 'Argentina',     code: 'ARG', flag: '🇦🇷', group: 'B', elo: 1954, avgGoalsFor: 2.1, avgGoalsAgainst: 0.8, avgCorners: 5.8, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 6,  name: 'Chile',         code: 'CHI', flag: '🇨🇱', group: 'B', elo: 1660, avgGoalsFor: 1.3, avgGoalsAgainst: 1.3, avgCorners: 4.6, avgYellowCards: 2.1, avgRedCards: 0.1 },
  { id: 7,  name: 'Perú',          code: 'PER', flag: '🇵🇪', group: 'B', elo: 1650, avgGoalsFor: 1.2, avgGoalsAgainst: 1.3, avgCorners: 4.3, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 8,  name: 'Australia',     code: 'AUS', flag: '🇦🇺', group: 'B', elo: 1645, avgGoalsFor: 1.3, avgGoalsAgainst: 1.4, avgCorners: 4.5, avgYellowCards: 1.8, avgRedCards: 0.0 },
  // Grupo C
  { id: 9,  name: 'EE.UU.',        code: 'USA', flag: '🇺🇸', group: 'C', elo: 1750, avgGoalsFor: 1.4, avgGoalsAgainst: 1.1, avgCorners: 4.6, avgYellowCards: 1.8, avgRedCards: 0.0 },
  { id: 10, name: 'Uruguay',       code: 'URU', flag: '🇺🇾', group: 'C', elo: 1790, avgGoalsFor: 1.4, avgGoalsAgainst: 1.0, avgCorners: 4.7, avgYellowCards: 2.3, avgRedCards: 0.1 },
  { id: 11, name: 'Bolivia',       code: 'BOL', flag: '🇧🇴', group: 'C', elo: 1530, avgGoalsFor: 0.9, avgGoalsAgainst: 1.7, avgCorners: 3.8, avgYellowCards: 2.3, avgRedCards: 0.2 },
  { id: 12, name: 'Serbia',        code: 'SRB', flag: '🇷🇸', group: 'C', elo: 1750, avgGoalsFor: 1.5, avgGoalsAgainst: 1.1, avgCorners: 5.0, avgYellowCards: 2.1, avgRedCards: 0.1 },
  // Grupo D
  { id: 13, name: 'Francia',       code: 'FRA', flag: '🇫🇷', group: 'D', elo: 1921, avgGoalsFor: 2.0, avgGoalsAgainst: 0.9, avgCorners: 5.6, avgYellowCards: 1.7, avgRedCards: 0.1 },
  { id: 14, name: 'Polonia',       code: 'POL', flag: '🇵🇱', group: 'D', elo: 1680, avgGoalsFor: 1.3, avgGoalsAgainst: 1.2, avgCorners: 4.7, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 15, name: 'Dinamarca',     code: 'DEN', flag: '🇩🇰', group: 'D', elo: 1795, avgGoalsFor: 1.5, avgGoalsAgainst: 1.0, avgCorners: 5.0, avgYellowCards: 1.7, avgRedCards: 0.0 },
  { id: 16, name: 'Costa Rica',    code: 'CRC', flag: '🇨🇷', group: 'D', elo: 1630, avgGoalsFor: 1.1, avgGoalsAgainst: 1.3, avgCorners: 4.0, avgYellowCards: 2.0, avgRedCards: 0.1 },
  // Grupo E
  { id: 17, name: 'Bélgica',       code: 'BEL', flag: '🇧🇪', group: 'E', elo: 1820, avgGoalsFor: 1.6, avgGoalsAgainst: 1.0, avgCorners: 5.1, avgYellowCards: 1.7, avgRedCards: 0.0 },
  { id: 18, name: 'Ucrania',       code: 'UKR', flag: '🇺🇦', group: 'E', elo: 1700, avgGoalsFor: 1.3, avgGoalsAgainst: 1.2, avgCorners: 4.6, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 19, name: 'España',        code: 'ESP', flag: '🇪🇸', group: 'E', elo: 1905, avgGoalsFor: 1.9, avgGoalsAgainst: 0.7, avgCorners: 6.1, avgYellowCards: 2.1, avgRedCards: 0.1 },
  { id: 20, name: 'Camerún',       code: 'CMR', flag: '🇨🇲', group: 'E', elo: 1620, avgGoalsFor: 1.2, avgGoalsAgainst: 1.4, avgCorners: 4.2, avgYellowCards: 2.2, avgRedCards: 0.1 },
  // Grupo F
  { id: 21, name: 'Brasil',        code: 'BRA', flag: '🇧🇷', group: 'F', elo: 1890, avgGoalsFor: 1.8, avgGoalsAgainst: 0.9, avgCorners: 5.4, avgYellowCards: 1.8, avgRedCards: 0.1 },
  { id: 22, name: 'Japón',         code: 'JPN', flag: '🇯🇵', group: 'F', elo: 1725, avgGoalsFor: 1.4, avgGoalsAgainst: 1.2, avgCorners: 5.0, avgYellowCards: 1.5, avgRedCards: 0.0 },
  { id: 23, name: 'Egipto',        code: 'EGY', flag: '🇪🇬', group: 'F', elo: 1630, avgGoalsFor: 1.1, avgGoalsAgainst: 1.2, avgCorners: 4.3, avgYellowCards: 2.0, avgRedCards: 0.1 },
  { id: 24, name: 'Alemania',      code: 'GER', flag: '🇩🇪', group: 'F', elo: 1845, avgGoalsFor: 1.7, avgGoalsAgainst: 1.1, avgCorners: 5.7, avgYellowCards: 1.8, avgRedCards: 0.1 },
  // Grupo G
  { id: 25, name: 'Portugal',      code: 'POR', flag: '🇵🇹', group: 'G', elo: 1860, avgGoalsFor: 1.8, avgGoalsAgainst: 1.0, avgCorners: 5.2, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 26, name: 'Rep. Checa',    code: 'CZE', flag: '🇨🇿', group: 'G', elo: 1680, avgGoalsFor: 1.3, avgGoalsAgainst: 1.2, avgCorners: 4.7, avgYellowCards: 1.8, avgRedCards: 0.1 },
  { id: 27, name: 'Turquía',       code: 'TUR', flag: '🇹🇷', group: 'G', elo: 1720, avgGoalsFor: 1.4, avgGoalsAgainst: 1.2, avgCorners: 4.9, avgYellowCards: 2.2, avgRedCards: 0.1 },
  { id: 28, name: 'Marruecos',     code: 'MAR', flag: '🇲🇦', group: 'G', elo: 1745, avgGoalsFor: 1.3, avgGoalsAgainst: 0.8, avgCorners: 4.5, avgYellowCards: 2.0, avgRedCards: 0.1 },
  // Grupo H
  { id: 29, name: 'Inglaterra',    code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'H', elo: 1875, avgGoalsFor: 1.7, avgGoalsAgainst: 1.0, avgCorners: 5.5, avgYellowCards: 1.6, avgRedCards: 0.0 },
  { id: 30, name: 'Nigeria',       code: 'NGA', flag: '🇳🇬', group: 'H', elo: 1680, avgGoalsFor: 1.4, avgGoalsAgainst: 1.3, avgCorners: 4.6, avgYellowCards: 2.0, avgRedCards: 0.1 },
  { id: 31, name: 'Irán',          code: 'IRN', flag: '🇮🇷', group: 'H', elo: 1620, avgGoalsFor: 1.1, avgGoalsAgainst: 1.2, avgCorners: 4.2, avgYellowCards: 2.0, avgRedCards: 0.1 },
  { id: 32, name: 'Eslovaquia',    code: 'SVK', flag: '🇸🇰', group: 'H', elo: 1660, avgGoalsFor: 1.2, avgGoalsAgainst: 1.2, avgCorners: 4.5, avgYellowCards: 1.9, avgRedCards: 0.1 },
  // Grupo I
  { id: 33, name: 'Países Bajos',  code: 'NED', flag: '🇳🇱', group: 'I', elo: 1835, avgGoalsFor: 1.7, avgGoalsAgainst: 1.0, avgCorners: 5.3, avgYellowCards: 1.7, avgRedCards: 0.1 },
  { id: 34, name: 'Senegal',       code: 'SEN', flag: '🇸🇳', group: 'I', elo: 1730, avgGoalsFor: 1.3, avgGoalsAgainst: 1.1, avgCorners: 4.4, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 35, name: 'Corea del Sur', code: 'KOR', flag: '🇰🇷', group: 'I', elo: 1692, avgGoalsFor: 1.3, avgGoalsAgainst: 1.2, avgCorners: 4.8, avgYellowCards: 1.7, avgRedCards: 0.1 },
  { id: 36, name: 'Rumanía',       code: 'ROU', flag: '🇷🇴', group: 'I', elo: 1650, avgGoalsFor: 1.2, avgGoalsAgainst: 1.3, avgCorners: 4.5, avgYellowCards: 1.9, avgRedCards: 0.1 },
  // Grupo J
  { id: 37, name: 'Colombia',      code: 'COL', flag: '🇨🇴', group: 'J', elo: 1798, avgGoalsFor: 1.5, avgGoalsAgainst: 1.1, avgCorners: 4.9, avgYellowCards: 2.2, avgRedCards: 0.1 },
  { id: 38, name: 'Italia',        code: 'ITA', flag: '🇮🇹', group: 'J', elo: 1780, avgGoalsFor: 1.5, avgGoalsAgainst: 0.9, avgCorners: 5.2, avgYellowCards: 2.0, avgRedCards: 0.1 },
  { id: 39, name: 'Arabia Saudí',  code: 'KSA', flag: '🇸🇦', group: 'J', elo: 1620, avgGoalsFor: 1.2, avgGoalsAgainst: 1.5, avgCorners: 4.1, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 40, name: 'Eslovenia',     code: 'SVN', flag: '🇸🇮', group: 'J', elo: 1620, avgGoalsFor: 1.1, avgGoalsAgainst: 1.3, avgCorners: 4.3, avgYellowCards: 1.8, avgRedCards: 0.1 },
  // Grupo K
  { id: 41, name: 'Croacia',       code: 'CRO', flag: '🇭🇷', group: 'K', elo: 1810, avgGoalsFor: 1.4, avgGoalsAgainst: 1.0, avgCorners: 4.9, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 42, name: 'Canadá',        code: 'CAN', flag: '🇨🇦', group: 'K', elo: 1700, avgGoalsFor: 1.4, avgGoalsAgainst: 1.2, avgCorners: 4.7, avgYellowCards: 1.8, avgRedCards: 0.1 },
  { id: 43, name: 'Ghana',         code: 'GHA', flag: '🇬🇭', group: 'K', elo: 1620, avgGoalsFor: 1.2, avgGoalsAgainst: 1.4, avgCorners: 4.3, avgYellowCards: 2.1, avgRedCards: 0.1 },
  { id: 44, name: 'Kuwait',        code: 'KUW', flag: '🇰🇼', group: 'K', elo: 1440, avgGoalsFor: 0.7, avgGoalsAgainst: 1.9, avgCorners: 3.5, avgYellowCards: 2.3, avgRedCards: 0.2 },
  // Grupo L
  { id: 45, name: 'Austria',       code: 'AUT', flag: '🇦🇹', group: 'L', elo: 1720, avgGoalsFor: 1.4, avgGoalsAgainst: 1.1, avgCorners: 4.8, avgYellowCards: 1.9, avgRedCards: 0.1 },
  { id: 46, name: 'Paraguay',      code: 'PAR', flag: '🇵🇾', group: 'L', elo: 1620, avgGoalsFor: 1.2, avgGoalsAgainst: 1.4, avgCorners: 4.2, avgYellowCards: 2.2, avgRedCards: 0.2 },
  { id: 47, name: 'Sudáfrica',     code: 'RSA', flag: '🇿🇦', group: 'L', elo: 1570, avgGoalsFor: 1.1, avgGoalsAgainst: 1.4, avgCorners: 4.1, avgYellowCards: 2.0, avgRedCards: 0.1 },
  { id: 48, name: 'Nueva Zelanda', code: 'NZL', flag: '🇳🇿', group: 'L', elo: 1500, avgGoalsFor: 0.9, avgGoalsAgainst: 1.6, avgCorners: 3.8, avgYellowCards: 1.7, avgRedCards: 0.0 },
]

export function getTeamByCode(code: string): Team | undefined {
  return WC2026_TEAMS.find(t => t.code === code)
}

export function getTeamsByGroup(group: string): Team[] {
  return WC2026_TEAMS.filter(t => t.group === group)
}

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
