/**
 * Whoop.js — Whoop API integration for the Productivity Playbook
 *
 * SETUP STEPS (one-time):
 * 1. Go to https://developer-dashboard.whoop.com/ and create an app
 * 2. Add redirect URI: http://localhost (you'll copy the code from the URL bar)
 * 3. Enable scopes: offline, read:cycles, read:sleep, read:recovery, read:profile
 * 4. Copy your Client ID and Client Secret
 * 5. In your sheet, go to Playbook > Whoop > Connect Whoop
 */

var WHOOP_AUTH_URL   = 'https://api.prod.whoop.com/oauth/oauth2/auth';
var WHOOP_TOKEN_URL  = 'https://api.prod.whoop.com/oauth/oauth2/token';
var WHOOP_API_BASE   = 'https://api.prod.whoop.com/developer/v2';
var WHOOP_SCOPES     = 'offline read:cycles read:sleep read:recovery read:profile';

// ============================================================
// STEP 1: SAVE CREDENTIALS
// ============================================================

/**
 * Prompt the user to enter their Whoop Client ID and Secret
 */
function whoopEnterCredentials() {
  var ui = SpreadsheetApp.getUi();

  var clientIdResult = ui.prompt(
    'Whoop Setup (1/2)',
    'Enter your Whoop Client ID\n(from developer-dashboard.whoop.com)',
    ui.ButtonSet.OK_CANCEL
  );
  if (clientIdResult.getSelectedButton() !== ui.Button.OK) return;
  var clientId = clientIdResult.getResponseText().trim();

  var clientSecretResult = ui.prompt(
    'Whoop Setup (2/2)',
    'Enter your Whoop Client Secret',
    ui.ButtonSet.OK_CANCEL
  );
  if (clientSecretResult.getSelectedButton() !== ui.Button.OK) return;
  var clientSecret = clientSecretResult.getResponseText().trim();

  if (!clientId || !clientSecret) {
    ui.alert('Both Client ID and Secret are required.');
    return;
  }

  var props = PropertiesService.getUserProperties();
  props.setProperty('whoop_client_id', clientId);
  props.setProperty('whoop_client_secret', clientSecret);

  ui.alert(
    'Credentials saved!\n\nNext step: Go to Playbook > Whoop > Authorize Whoop\nto connect your account.'
  );
}

// ============================================================
// STEP 2: AUTHORIZE
// ============================================================

/**
 * Generate the authorization URL and walk the user through the OAuth flow.
 * Since Apps Script can't receive OAuth callbacks directly, we use localhost
 * as the redirect — the user copies the `code` from the URL bar.
 */
function whoopAuthorize() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getUserProperties();
  var clientId = props.getProperty('whoop_client_id');

  if (!clientId) {
    ui.alert('Set up credentials first: Playbook > Whoop > Enter Credentials');
    return;
  }

  var redirectUri = 'http://localhost';
  var state = Utilities.getUuid();
  props.setProperty('whoop_oauth_state', state);

  var authUrl = WHOOP_AUTH_URL +
    '?client_id=' + encodeURIComponent(clientId) +
    '&redirect_uri=' + encodeURIComponent(redirectUri) +
    '&scope=' + encodeURIComponent(WHOOP_SCOPES) +
    '&response_type=code' +
    '&state=' + state;

  var message =
    'STEP 1: Copy this URL and open it in your browser:\n\n' +
    authUrl + '\n\n' +
    'STEP 2: Sign in to Whoop and click Allow.\n\n' +
    'STEP 3: Your browser will show "This site can\'t be reached" — that\'s normal.\n' +
    'Look at the URL bar, it will look like:\n' +
    'http://localhost/?code=XXXXXX&state=...\n\n' +
    'STEP 4: Copy just the code value (between code= and &state)\n' +
    'then go to Playbook > Whoop > Enter Auth Code.';

  ui.alert('Connect Your Whoop', message, ui.ButtonSet.OK);
}

/**
 * Accept the authorization code and exchange it for tokens
 */
function whoopEnterAuthCode() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getUserProperties();
  var clientId = props.getProperty('whoop_client_id');
  var clientSecret = props.getProperty('whoop_client_secret');

  if (!clientId || !clientSecret) {
    ui.alert('Set up credentials first: Playbook > Whoop > Enter Credentials');
    return;
  }

  var codeResult = ui.prompt(
    'Enter Whoop Auth Code',
    'Paste the code from the URL bar (the value after code= and before &state):',
    ui.ButtonSet.OK_CANCEL
  );
  if (codeResult.getSelectedButton() !== ui.Button.OK) return;

  var code = codeResult.getResponseText().trim();
  if (!code) {
    ui.alert('No code entered.');
    return;
  }

  // Exchange code for tokens
  var success = whoopExchangeCode(code, clientId, clientSecret);

  if (success) {
    ui.alert(
      'Whoop connected successfully!\n\n' +
      'Your recovery, HRV, sleep, and strain data will now auto-populate\n' +
      'in the Daily Log every morning.\n\n' +
      'To test it now, go to Playbook > Whoop > Fetch Today\'s Data.'
    );
  } else {
    ui.alert('Failed to connect. Check your credentials and try again.');
  }
}

/**
 * Exchange authorization code for access + refresh tokens
 */
function whoopExchangeCode(code, clientId, clientSecret) {
  var payload = {
    grant_type: 'authorization_code',
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: 'http://localhost',
    scope: WHOOP_SCOPES
  };

  var options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: payload,
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(WHOOP_TOKEN_URL, options);
    var code_ = response.getResponseCode();

    if (code_ !== 200) {
      Logger.log('Whoop token exchange failed: ' + response.getContentText());
      return false;
    }

    var tokens = JSON.parse(response.getContentText());
    whoopStoreTokens(tokens);
    return true;
  } catch (err) {
    Logger.log('Whoop exchange error: ' + err.toString());
    return false;
  }
}

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

/**
 * Store tokens securely in UserProperties
 */
function whoopStoreTokens(tokens) {
  var props = PropertiesService.getUserProperties();
  var expiresAt = new Date().getTime() + (tokens.expires_in * 1000);
  props.setProperty('whoop_access_token', tokens.access_token);
  props.setProperty('whoop_refresh_token', tokens.refresh_token);
  props.setProperty('whoop_token_expires_at', expiresAt.toString());
}

/**
 * Get a valid access token, refreshing if needed
 */
function whoopGetAccessToken() {
  var props = PropertiesService.getUserProperties();
  var accessToken = props.getProperty('whoop_access_token');
  var refreshToken = props.getProperty('whoop_refresh_token');
  var expiresAt = parseInt(props.getProperty('whoop_token_expires_at') || '0');

  if (!accessToken || !refreshToken) return null;

  // Refresh if expiring within 5 minutes
  var now = new Date().getTime();
  if (now >= expiresAt - 300000) {
    return whoopRefreshAccessToken(refreshToken);
  }

  return accessToken;
}

/**
 * Refresh the access token using the refresh token
 */
function whoopRefreshAccessToken(refreshToken) {
  var props = PropertiesService.getUserProperties();
  var clientId = props.getProperty('whoop_client_id');
  var clientSecret = props.getProperty('whoop_client_secret');

  if (!clientId || !clientSecret || !refreshToken) return null;

  var payload = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    scope: WHOOP_SCOPES
  };

  var options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: payload,
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(WHOOP_TOKEN_URL, options);
    if (response.getResponseCode() !== 200) {
      Logger.log('Whoop token refresh failed: ' + response.getContentText());
      return null;
    }

    var tokens = JSON.parse(response.getContentText());
    whoopStoreTokens(tokens);
    return tokens.access_token;
  } catch (err) {
    Logger.log('Whoop refresh error: ' + err.toString());
    return null;
  }
}

// ============================================================
// DATA FETCHING
// ============================================================

/**
 * Make an authenticated GET request to the Whoop API
 */
function whoopGet(endpoint) {
  var accessToken = whoopGetAccessToken();
  if (!accessToken) {
    Logger.log('Whoop: no valid access token');
    return null;
  }

  var options = {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(WHOOP_API_BASE + endpoint, options);
    var code = response.getResponseCode();

    if (code === 401) {
      Logger.log('Whoop: 401 unauthorized — token may be revoked');
      return null;
    }
    if (code !== 200) {
      Logger.log('Whoop API error ' + code + ': ' + response.getContentText());
      return null;
    }

    return JSON.parse(response.getContentText());
  } catch (err) {
    Logger.log('Whoop request error: ' + err.toString());
    return null;
  }
}

/**
 * Fetch yesterday's Whoop data and populate the Daily Log
 * Called by time-driven trigger every morning at 7 AM
 */
function whoopFetchDaily(optDate) {
  var accessToken = whoopGetAccessToken();
  if (!accessToken) {
    Logger.log('Whoop: not connected, skipping daily fetch');
    return;
  }

  var targetDate = optDate || yesterday();
  var targetDateStr = Utilities.formatDate(targetDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');

  // Get the most recent cycle (covers yesterday)
  var cyclesData = whoopGet('/cycle?limit=5');
  if (!cyclesData || !cyclesData.records || cyclesData.records.length === 0) {
    Logger.log('Whoop: no cycle data returned');
    return;
  }

  // Find the cycle that covers yesterday
  var targetCycle = null;
  for (var i = 0; i < cyclesData.records.length; i++) {
    var cycle = cyclesData.records[i];
    if (!cycle.start) continue;

    var cycleDate = Utilities.formatDate(
      new Date(cycle.start),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd'
    );

    if (cycleDate === targetDateStr) {
      targetCycle = cycle;
      break;
    }
  }

  if (!targetCycle) {
    Logger.log('Whoop: no cycle found for ' + targetDateStr);
    return;
  }

  var cycleId = targetCycle.id;
  var strain = targetCycle.score ? targetCycle.score.strain : null;

  // Get recovery for this cycle
  var recoveryData = whoopGet('/cycle/' + cycleId + '/recovery');
  var recovery = null;
  var hrv = null;
  var restingHR = null;

  if (recoveryData && recoveryData.score) {
    recovery = recoveryData.score.recovery_score;
    hrv = recoveryData.score.hrv_rmssd_milli
      ? Math.round(recoveryData.score.hrv_rmssd_milli)
      : null;
    restingHR = recoveryData.score.resting_heart_rate;
  }

  // Get sleep for this cycle
  var sleepData = whoopGet('/cycle/' + cycleId + '/sleep');
  var sleepPerformance = null;

  if (sleepData && sleepData.score) {
    sleepPerformance = sleepData.score.sleep_performance_percentage;
  }

  // Write to Daily Log
  var log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.DAILY_LOG);
  if (!log) return;

  var row = findDateRow(log, targetDate);
  if (row < 0) {
    Logger.log('Whoop: no Daily Log row found for ' + targetDateStr);
    return;
  }

  if (recovery !== null)     log.getRange(row, DL.WHOOP_RECOVERY).setValue(recovery);
  if (hrv !== null)          log.getRange(row, DL.WHOOP_HRV).setValue(hrv);
  if (restingHR !== null)    log.getRange(row, DL.WHOOP_RESTING_HR).setValue(restingHR);
  if (sleepPerformance !== null) log.getRange(row, DL.WHOOP_SLEEP).setValue(Math.round(sleepPerformance));
  if (strain !== null)       log.getRange(row, DL.WHOOP_STRAIN).setValue(Math.round(strain * 10) / 10);

  Logger.log('Whoop data populated for ' + targetDateStr + ': recovery=' + recovery +
    ', HRV=' + hrv + ', RHR=' + restingHR + ', sleep=' + sleepPerformance + ', strain=' + strain);

  // Also refresh dashboard to show updated recovery
  refreshDashboard();
}

/**
 * Manually trigger a Whoop data fetch for today/yesterday
 * Accessible from the Playbook menu
 */
function whoopFetchManual() {
  var ui = SpreadsheetApp.getUi();
  var accessToken = whoopGetAccessToken();

  if (!accessToken) {
    ui.alert('Whoop is not connected.\nGo to Playbook > Whoop > Enter Credentials to set up.');
    return;
  }

  try {
    // Try yesterday first; if no row exists yet, fall back to today
    var log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.DAILY_LOG);
    var useDate = (log && findDateRow(log, yesterday()) < 0) ? today() : yesterday();
    whoopFetchDaily(useDate);
    ui.alert('Whoop data fetched! Check your Daily Log — recovery, HRV, sleep, and strain have been populated.');
  } catch (err) {
    ui.alert('Error fetching Whoop data: ' + err.toString());
  }
}

/**
 * Check if Whoop is connected
 */
function whoopIsConnected() {
  var props = PropertiesService.getUserProperties();
  return !!(props.getProperty('whoop_access_token') && props.getProperty('whoop_refresh_token'));
}

/**
 * Disconnect Whoop (clear all stored tokens and credentials)
 */
function whoopDisconnect() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(
    'Disconnect Whoop?',
    'This will remove your Whoop credentials and stop automatic data sync.',
    ui.ButtonSet.YES_NO
  );
  if (result !== ui.Button.YES) return;

  var props = PropertiesService.getUserProperties();
  props.deleteProperty('whoop_access_token');
  props.deleteProperty('whoop_refresh_token');
  props.deleteProperty('whoop_token_expires_at');
  props.deleteProperty('whoop_client_id');
  props.deleteProperty('whoop_client_secret');
  props.deleteProperty('whoop_oauth_state');

  ui.alert('Whoop disconnected.');
}

/**
 * Show current Whoop connection status
 */
function whoopStatus() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getUserProperties();
  var hasCredentials = !!(props.getProperty('whoop_client_id'));
  var hasTokens = whoopIsConnected();
  var expiresAt = props.getProperty('whoop_token_expires_at');
  var expiryStr = expiresAt ?
    new Date(parseInt(expiresAt)).toLocaleString() : 'N/A';

  var status = 'Whoop Connection Status\n\n' +
    'Credentials saved: ' + (hasCredentials ? 'Yes' : 'No') + '\n' +
    'Connected: ' + (hasTokens ? 'Yes ✓' : 'No') + '\n' +
    'Token expires: ' + expiryStr;

  ui.alert(status);
}
