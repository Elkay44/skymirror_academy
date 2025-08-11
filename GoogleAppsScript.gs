// Google Apps Script code for handling form submissions

// Configuration
const ADMIN_EMAIL = 'contact@skymirror.eu';
const COPY_EMAIL = 'lukman.ibrahim@skymirror.eu';
const WEBSITE_URL = 'https://www.skymirror.academy';

// Entry point for form submissions
function doPost(e) {
  try {
    // Log incoming request
    Logger.log('Received form submission');
    
    // Get the form data from the request
    const formData = e.postData.contents;
    if (!formData) {
      throw new Error('No form data received');
    }
    
    // Parse the JSON data
    const data = JSON.parse(formData);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'program', 'background'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Save to Google Sheets
    saveToSheet(data);
    
    // Send confirmation email to applicant
    sendConfirmationEmail(data);
    
    // Send notification to admin
    sendAdminNotification(data);
    
    // Prepare success response
    const response = ContentService.createTextOutput(JSON.stringify({ 
      status: 'success',
      message: 'Application received successfully'
    }));
    
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    };
    
    // Set headers
    response.setMimeType(ContentService.MimeType.JSON);
    response.setHeaders(headers);
    
    return response;
  } catch (error) {
    Logger.log('Error processing form submission: ' + error.toString());
    
    // Prepare error response
    const response = ContentService.createTextOutput(JSON.stringify({ 
      status: 'error',
      message: error.toString(),
      timestamp: new Date().toISOString()
    }));
    
    // Add CORS headers to error response
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    };
    
    response.setMimeType(ContentService.MimeType.JSON);
    response.setHeaders(headers);
    
    return response;
  }
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
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
  };
  
  // Set headers
  response.setHeaders(headers);
  
  return response;
}

function saveToSheet(data) {
  try {
    // Get or create the spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error('No spreadsheet found');
    }
    
    // Get or create the sheet
    let sheet = ss.getSheetByName('Applications');
    if (!sheet) {
      sheet = ss.insertSheet('Applications');
      // Add headers if this is a new sheet
      const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Program', 'Background', 'Why Interested', 'Vanguard Cohort Interest'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Get next row
    const row = sheet.getLastRow() + 1;
    
    // Add timestamp
    sheet.getRange(row, 1).setValue(new Date());
    
    // Add form data
    sheet.getRange(row, 2).setValue(data.firstName + ' ' + data.lastName);
    sheet.getRange(row, 3).setValue(data.email);
    sheet.getRange(row, 4).setValue(data.phone);
    sheet.getRange(row, 5).setValue(data.program);
    sheet.getRange(row, 6).setValue(data.background);
    sheet.getRange(row, 7).setValue(data.whyInterested);
    sheet.getRange(row, 8).setValue(data.VanguardCohortInterest);
    
    // Log success
    Logger.log('Saved application to row ' + row);
    return true;
  } catch (error) {
    Logger.log('Error saving to sheet: ' + error.toString());
    throw error;
  }
}

function sendConfirmationEmail(data) {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7C3AED;">Thank you for your application!</h1>
        <p>Dear ${data.firstName} ${data.lastName},</p>
        <p>Thank you for applying to Skymirror Academy. We've received your application and will review it shortly.</p>
        <p>Here's a summary of your application:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Program:</strong> ${data.program}</li>
          <li><strong>Background:</strong> ${data.background}</li>
          <li><strong>Interest in Vanguard Cohort:</strong> ${data.VanguardCohortInterest ? 'Yes' : 'No'}</li>
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
    
    Logger.log('Sent confirmation email to ' + data.email);
    return true;
  } catch (error) {
    Logger.log('Error sending confirmation email: ' + error.toString());
    throw error;
  }
}
}

function sendAdminNotification(data) {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7C3AED;">New Application Received</h1>
        <p>New application from ${data.firstName} ${data.lastName} (${data.email})</p>
        <p>Details:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Program:</strong> ${data.program}</li>
          <li><strong>Background:</strong> ${data.background}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
          <li><strong>Interest in Vanguard Cohort:</strong> ${data.VanguardCohortInterest ? 'Yes' : 'No'}</li>
          <li><strong>Why Interested:</strong> ${data.whyInterested}</li>
        </ul>
        <p style="font-size: 0.9em; color: #666;">
          ${WEBSITE_URL}<br>
          Budapest President Centre<br>
          Kálmán Imre utca 1<br>
          1054 Budapest, Hungary<br>
          contact@skymirror.eu
        </p>
      </div>
    `;

    // Send to contact@skymirror.eu (main contact email)
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: 'New Application Received - Skymirror Academy',
      htmlBody: htmlTemplate,
      replyTo: ADMIN_EMAIL
    });

    // Send copy to lukman.ibrahim@skymirror.eu
    MailApp.sendEmail({
      to: COPY_EMAIL,
      subject: 'New Application Copy - Skymirror Academy',
      htmlBody: htmlTemplate,
      replyTo: ADMIN_EMAIL
    });

    Logger.log('Sent admin notification emails');
    return true;
  } catch (error) {
    Logger.log('Error sending admin notification: ' + error.toString());
    throw error;
  }
}
  });

  // Send copy to lukman.ibrahim@skymirror.eu
  MailApp.sendEmail({
    to: COPY_EMAIL,
    subject: 'New Application Copy - Skymirror Academy',
    htmlBody: htmlTemplate
  });
  
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
