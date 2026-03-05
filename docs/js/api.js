/**
 * api.js — Google Sheets API client (direct REST calls, no gapi library)
 */

import { SHEET_ID, SCOPES } from '../config.js';

let accessToken = null;
let tokenClient = null;
let onAuthCallback = null;

/**
 * Initialize Google Identity Services OAuth
 */
export function initAuth(callback) {
  onAuthCallback = callback;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: import.meta.url.includes('localhost') ? '' : '',
    scope: SCOPES,
    callback: handleTokenResponse
  });
}

/**
 * Update the OAuth client ID (called from app.js after config loads)
 */
export function setClientId(clientId) {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: handleTokenResponse
  });
}

/**
 * Trigger sign-in
 */
export function signIn() {
  if (!tokenClient) {
    console.error('Auth not initialized');
    return;
  }
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

/**
 * Try silent token refresh (no popup if Google session is active)
 */
export function silentRefresh() {
  if (!tokenClient) return;
  tokenClient.requestAccessToken({ prompt: '' });
}

/**
 * Handle token response from GIS
 */
function handleTokenResponse(response) {
  if (response.error) {
    console.error('Auth error:', response.error);
    return;
  }
  accessToken = response.access_token;
  // Set refresh timer (tokens expire in ~3600s, refresh at 50 min)
  setTimeout(silentRefresh, 50 * 60 * 1000);
  if (onAuthCallback) onAuthCallback();
}

/**
 * Check if authenticated
 */
export function isAuthenticated() {
  return !!accessToken;
}

/**
 * Sign out
 */
export function signOut() {
  if (accessToken) {
    google.accounts.oauth2.revoke(accessToken);
    accessToken = null;
  }
}

/**
 * Read a range from the sheet
 * @param {string} sheetName - e.g. "Daily Log"
 * @param {string} range - e.g. "A1:Z100"
 * @returns {Array<Array>} 2D array of values
 */
export async function readRange(sheetName, range) {
  const fullRange = `${sheetName}!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(fullRange)}`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    if (response.status === 401) {
      silentRefresh();
      throw new Error('Token expired, refreshing...');
    }
    throw new Error(`Sheets API error: ${response.status}`);
  }

  const data = await response.json();
  return data.values || [];
}

/**
 * Write values to a range (overwrites)
 */
export async function writeRange(sheetName, range, values) {
  const fullRange = `${sheetName}!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(fullRange)}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  });

  if (!response.ok) {
    if (response.status === 401) {
      silentRefresh();
      throw new Error('Token expired, refreshing...');
    }
    throw new Error(`Sheets API write error: ${response.status}`);
  }

  return response.json();
}

/**
 * Append a row to a sheet
 */
export async function appendRow(sheetName, values) {
  const range = `${sheetName}!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: [values] })
  });

  if (!response.ok) {
    throw new Error(`Sheets API append error: ${response.status}`);
  }

  return response.json();
}

/**
 * Batch read multiple ranges in one API call
 */
export async function batchRead(ranges) {
  const rangeParams = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?${rangeParams}`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    if (response.status === 401) {
      silentRefresh();
      throw new Error('Token expired, refreshing...');
    }
    throw new Error(`Sheets API batch error: ${response.status}`);
  }

  const data = await response.json();
  return (data.valueRanges || []).map(vr => vr.values || []);
}

/**
 * Update a single cell
 */
export async function updateCell(sheetName, cell, value) {
  return writeRange(sheetName, cell, [[value]]);
}
