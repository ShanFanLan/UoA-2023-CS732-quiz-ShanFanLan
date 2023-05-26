/**
 * API URLs accessed from various frontend locations
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

export const POKEMON_URL = `${API_BASE_URL}/pokemon`;
export const USERS_URL = `${API_BASE_URL}/users`;
export const SPECIES_URL = `${API_BASE_URL}/species`;

export const CREATE_ACCOUNT_URL = `${USERS_URL}/create`;
export const LOGIN_URL = `${USERS_URL}/login`;
