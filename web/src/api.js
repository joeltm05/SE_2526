// Determines the base URL for API calls.
// - In development, default to http://localhost:3001 if not provided.
// - In production, default to same-origin ('') so the frontend can be served behind the same domain/proxy.
let inferredBase = '';
try {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    inferredBase = 'http://localhost:3001';
  }
} catch { }
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').trim() || inferredBase;

import axios from 'axios';

// Token management (stored in localStorage for simplicity)
export function setAuthToken(token) {
  if (token) localStorage.setItem('authToken', token); else localStorage.removeItem('authToken');
}
export function getAuthToken() {
  try { return localStorage.getItem('authToken'); } catch { return null; }
}

/**
 * Small Axios wrapper for JSON APIs with friendly error messages.
 * @param {string} path - The API path, e.g. '/api/spots'
 * @param {RequestInit} options - Fetch-like options (method, headers, body...)
 */
export async function api(path, options = {}) {
  try {
    const method = (options.method || 'GET').toLowerCase();
    const url = `${API_BASE}${path}`;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const data = options.body ? JSON.parse(options.body) : undefined;
    const res = await axios({ url, method, headers, data, withCredentials: false });
    return res.data;
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || 'Erro';
    throw new Error(msg);
  }
}
