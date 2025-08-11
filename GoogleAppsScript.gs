// Google Apps Script code for handling form submissions

// Configuration
const ADMIN_EMAIL = 'lukman.ibrahim@skymirror.eu';
const WEBSITE_URL = 'https://www.skymirror.academy';

// Entry point for form submissions
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Save to Google Sheets
    saveToSheet(data);
    
    // Send confirmation email to applicant
    sendConfirmationEmail(data);
    
    // Send notification to admin
    sendAdminNotification(data);
    
    const response = ContentService.createTextOutput(JSON.stringify({ status: 'success' }));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    const response = ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: error.toString() 
    }));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }
}

// Handle CORS preflight requests
function doGet(e) {
  const response = ContentService.createTextOutput(JSON.stringify({ status: 'ok' }));
  response.setMimeType(ContentService.MimeType.JSON);
  return response;
}

function saveToSheet(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const row = sheet.getLastRow() + 1;
  
  // Add timestamp
  sheet.getRange(row, 1).setValue(new Date());
  
  // Add form data
  sheet.getRange(row, 2).setValue(data.email);
  sheet.getRange(row, 3).setValue(data.name);
  sheet.getRange(row, 4).setValue(data.background);
  sheet.getRange(row, 5).setValue(data.program);
  sheet.getRange(row, 6).setValue(data.message);
  
  // Add more fields as needed
}

function sendConfirmationEmail(data) {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #7C3AED;">Thank you for your application!</h1>
      <p>Dear ${data.name},</p>
      <p>Thank you for applying to Skymirror Academy. We've received your application and will review it shortly.</p>
      <p>Here's a summary of your application:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Program:</strong> ${data.program}</li>
        <li><strong>Background:</strong> ${data.background}</li>
      </ul>
      <p>Best regards,<br>The Skymirror Academy Team</p>
      <p style="font-size: 0.9em; color: #666;">
        ${WEBSITE_URL}<br>
        Budapest President Centre<br>
        Kálmán Imre utca 1<br>
        1054 Budapest, Hungary<br>
        contact@skymirror.eu
      </p>
    </div>
  `;
  
  MailApp.sendEmail({
    to: data.email,
    subject: 'Application Received - Skymirror Academy',
    htmlBody: htmlTemplate,
    replyTo: ADMIN_EMAIL
  });
}

function sendAdminNotification(data) {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #7C3AED;">New Application Received</h1>
      <p>New application from ${data.name} (${data.email})</p>
      <p>Details:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Program:</strong> ${data.program}</li>
        <li><strong>Background:</strong> ${data.background}</li>
        <li><strong>Message:</strong> ${data.message}</li>
      </ul>
    </div>
  `;
  
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: 'New Application Received - Skymirror Academy',
    htmlBody: htmlTemplate
  });
}

// Function to create a web app URL
function getWebAppUrl() {
  const scriptId = ScriptApp.getScriptId();
  const url = ScriptApp.getService().getUrl();
  Logger.log('Script ID: ' + scriptId);
  Logger.log('Web App URL: ' + url);
  return url;
}

// Enable CORS
function enableCors() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  return headers;
}
