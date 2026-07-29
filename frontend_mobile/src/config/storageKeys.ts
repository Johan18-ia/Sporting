// src/config/storageKeys.ts
// ====================================================
// CLAVES DE ASYNC STORAGE — centralizadas para evitar typos
// ====================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
  // TournamentModel local (paridad con web)
  TOURNAMENTS: 'sporting_tournaments',
  // TeamModel local (paridad con web)
  TEAMS: 'sporting_teams_local',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]