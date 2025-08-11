const ADMIN_EMAIL = 'contact@skymirror.eu';

/**
 * Handles CORS preflight requests
 */
function doOptions(e) {
  return ContentService.createTextOutput(JSON.stringify({status: "success"}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Main function that handles form submissions
 * @param {Object} e The event object containing the form data
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Process form data
    const sheet = SpreadsheetApp.getActiveSheet();
    const row = sheet.getLastRow() + 1;
    
    // Add headers if they don't exist
    if (sheet.getLastRow() === 0) {
      const headers = Object.keys(data);
      sheet.appendRow(headers);
    }
    
    // Add data to sheet
    const values = Object.values(data);
    sheet.appendRow(values);
    
    // Send confirmation email
    sendConfirmationEmail(data);
    
    // Return success response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

/**
 * Sends a templated confirmation email to the applicant.
 * @param {Object} data The parsed JSON data from the form.
 */
function sendConfirmationEmail(data) {
  const email = data.email;
  const firstName = data.firstName;
  const noReplyEmail = 'no-reply@skymirror.eu';  // Update this to your domain's no-reply email
  
  // Send single confirmation email to applicant from no-reply address
  GmailApp.sendEmail(email, 
    'Skymirror Academy Application Received',
    '', // Empty body for HTML only
    {
      from: `Skymirror Academy <${noReplyEmail}>`,
      replyTo: ADMIN_EMAIL, // Replies will go to admin email
      name: 'Skymirror Academy',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6; text-align: center;">Thank you for your application!</h1>
          <p style="color: #1f2937; line-height: 1.6;">Dear ${firstName},</p>
          <p style="color: #1f2937; line-height: 1.6;">We've received your application for Skymirror Academy's program. Here's what happens next:</p>
          <ol style="color: #1f2937; line-height: 1.6;">
            <li>Our team will review your application.</li>
            <li>We'll contact you within 7-10 business days.</li>
            <li>Next steps will be shared via email.</li>
          </ol>
          <p style="color: #1f2937; line-height: 1.6;">If you have any questions, please reply to this email or contact us at ${ADMIN_EMAIL}.</p>
          <p style="color: #1f2937; line-height: 1.6;">Best regards,<br>The Skymirror Academy Team</p>
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
            This is an automated message. Please do not reply to this email.<br>
            Website: https://skymirror.eu<br>
            Contact: ${ADMIN_EMAIL}
          </p>
        </div>
      `
    }
  );
  
  // Send notification to admin
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: 'New Skymirror Academy Application',
    htmlBody: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Application Received</h2>
        <p>Application received from: ${data.firstName} ${data.lastName}</p>
        <p>Email: ${data.email}</p>
      </div>
    `
  });
  
  Logger.log(`Confirmation email sent from no-reply to ${data.email}.`);
}