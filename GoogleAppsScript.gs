// Google Apps Script code for handling form submissions

// A project by Skymirror (www.skymirror.eu)
//
// This script is designed to be deployed as a web app to handle form submissions from a website.
// It performs the following actions:
// 1. Receives form data via a POST request.
// 2. Validates the presence of required fields.
// 3. Saves the application data to a new row in a Google Sheet named "Applications".
// 4. Sends a confirmation email to the applicant.
// 5. Sends a notification email to the site administrators.
// 6. Handles CORS preflight requests to allow cross-domain communication.

// --- CONFIGURATION ---
// Set the email addresses for notifications.
const ADMIN_EMAIL = 'lukmanibrahim1998@gmail.com';
const COPY_EMAIL = 'lukman.ibrahim@skymirror.eu';

// Set the website URL for use in email footers.
const WEBSITE_URL = 'https://www.skymirror.academy';

// Function to initialize the spreadsheet
function initializeSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('No spreadsheet found. Please create a new spreadsheet and share it with this script.');
  }
  
  // Create or get the applications sheet
  let sheet = ss.getSheetByName('Applications');
  if (!sheet) {
    sheet = ss.insertSheet('Applications');
    // Add headers
    const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Program', 'Background', 'Why Interested', 'Vanguard Cohort Interest'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Set permissions
  const me = Session.getActiveUser().getEmail();
  const editors = ss.getEditors();
  if (!editors.some(editor => editor === me)) {
    ss.addEditor(me);
  }
  
  return ss;
}

// Entry point for form submissions
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // Wait up to 30 seconds to prevent concurrent writes.

  try {
    Logger.log('Received POST request.');

    // Parse the JSON data from the request body.
    const data = JSON.parse(e.postData.contents);

    // Validate that all required fields are present.
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'program', 'background'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Process the data.
    saveToSheet(data);
    sendConfirmationEmail(data);
    sendAdminNotification(data);

    // Return a success response.
    return createJsonResponse({
      status: 'success',
      message: 'Application received successfully.'
    });

  } catch (error) {
    Logger.log(`Error processing form submission: ${error.toString()}`);
    // Return an error response.
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    }, 500); // Use a 500 status code for server errors.
  } finally {
    lock.releaseLock(); // Always release the lock.
  }
}

function doOptions() {
  Logger.log('Received OPTIONS preflight request.');
  return createJsonResponse({}, 200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
}

function saveToSheet(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Applications');
    if (!sheet) {
        // If the sheet doesn't exist, create it and add headers.
        const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Applications');
        const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Program', 'Background', 'Reason for Interest', 'Vanguard Cohort Interest'];
        newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Append the new application data as a new row.
    sheet.appendRow([
      new Date(), // Timestamp
      `${data.firstName} ${data.lastName}`,
      data.email,
      data.phone,
      data.program,
      data.background,
      data.whyInterested || 'N/A', // Use 'N/A' if optional field is empty
      data.VanguardCohortInterest ? 'Yes' : 'No'
    ]);
    Logger.log('Application data saved to Google Sheet.');
  } catch (error) {
    Logger.log(`Error saving to sheet: ${error.toString()}`);
    throw new Error('Could not save data to the spreadsheet.'); // Propagate error
  }
}

function sendConfirmationEmail(data) {
  try {
    const subject = 'Application Received - Skymirror Academy';
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #7C3AED;">Thank you for your application!</h1>
        <p>Dear ${data.firstName},</p>
        <p>We have successfully received your application for Skymirror Academy and will review it shortly. We appreciate your interest in joining our program.</p>
        <p><strong>Here's a summary of your submission:</strong></p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Program:</strong> ${data.program}</li>
          <li><strong>Interest in Vanguard Cohort:</strong> ${data.VanguardCohortInterest ? 'Yes' : 'No'}</li>
        </ul>
        <p>If you have any questions, please feel free to contact us by replying to this email.</p>
        <p>Best regards,<br>The Skymirror Academy Team</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 0.9em; color: #666;">
          ${WEBSITE_URL}<br>
          Kálmán Imre utca 1, 1054 Budapest, Hungary<br>
          ${ADMIN_EMAIL}
        </p>
      </div>`;

    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      htmlBody: htmlTemplate,
      replyTo: ADMIN_EMAIL
    });
    Logger.log(`Confirmation email sent to ${data.email}.`);
  } catch (error) {
    Logger.log(`Error sending confirmation email: ${error.toString()}`);
    // Decide if you want to throw an error here. The main process might still be considered a success.
  }
}

function sendAdminNotification(data) {
  try {
    const subject = `New Application Received: ${data.firstName} ${data.lastName}`;
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #7C3AED;">New Application Received</h1>
        <p>A new application has been submitted through the website.</p>
        <p><strong>Applicant Details:</strong></p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
        </ul>
        <p><strong>Application Information:</strong></p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Program:</strong> ${data.program}</li>
          <li><strong>Background:</strong> ${data.background}</li>
          <li><strong>Reason for Interest:</strong> ${data.whyInterested || 'N/A'}</li>
          <li><strong>Interest in Vanguard Cohort:</strong> ${data.VanguardCohortInterest ? 'Yes' : 'No'}</li>
        </ul>
      </div>`;

    // Send email to the primary admin and the copy recipient
    MailApp.sendEmail(ADMIN_EMAIL, subject, '', { htmlBody: htmlTemplate, replyTo: data.email });
    MailApp.sendEmail(COPY_EMAIL, subject, '', { htmlBody: htmlTemplate, replyTo: data.email });

    Logger.log('Admin notification emails sent.');
  } catch (error) {
    Logger.log(`Error sending admin notification: ${error.toString()}`);
  }
}

function createJsonResponse(payload, statusCode = 200, headers = {}) {
  const response = ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
    
  // While Google Apps Script doesn't truly support status codes, it's good practice.
  // The CORS headers are the most important part for the browser.
  response.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...headers
  });
  
  return response;
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
