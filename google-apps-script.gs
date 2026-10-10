/**
 * Sanjana & Vidyasagar wedding guest Q&A collector.
 * Create a Google Sheet, open Extensions > Apps Script, paste this code,
 * then Deploy > New deployment > Web app.
 * Execute as: Me. Who has access: Anyone.
 * Copy the deployed web-app URL into config.js as responseEndpoint.
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guest Answers');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Guest Answers');
      sheet.appendRow(['Timestamp', 'Guest name', 'Q1: Who said I love you first?', 'Q2: Last bite thief', 'Q3: Takes longer to get ready', 'Q4: Married-life prediction', 'Q5: One-word blessing', 'Message', 'Wedding']);
      sheet.setFrozenRows(1);
    }
    var payload = JSON.parse((e && e.parameter && e.parameter.payload) || '{}');
    sheet.appendRow([
      new Date(),
      String(payload.guestName || '').slice(0, 100),
      String(payload.q1 || '').slice(0, 100),
      String(payload.q2 || '').slice(0, 100),
      String(payload.q3 || '').slice(0, 100),
      String(payload.q4 || '').slice(0, 100),
      String(payload.q5 || '').slice(0, 100),
      String(payload.message || '').slice(0, 500),
      String(payload.wedding || 'Sanjana Mishra & Vidyasagar Pant').slice(0, 150)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
