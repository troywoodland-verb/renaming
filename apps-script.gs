/**
 * Name Submission → Google Sheet
 * Paste into Extensions → Apps Script on your private Sheet, then deploy as a web app.
 * The script runs as you and writes to your Sheet; submitters never get access to it.
 */
const SHEET_NAME = 'Submissions';
const HEADERS = ['Submitted', 'First name', 'Last name', 'Suggested name', 'Reasons'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return ok_(); // spam trap filled in: drop silently

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    sheet.appendRow([
      new Date(),
      clean_(p.firstName),
      clean_(p.lastName),
      clean_(p.suggestedName),
      clean_(p.reasons, 5000)
    ]);
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

// Trim, cap length, and stop anything starting with = + - @ being read as a formula.
function clean_(v, max) {
  let s = String(v || '').trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
