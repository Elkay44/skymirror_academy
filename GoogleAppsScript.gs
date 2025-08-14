const ADMIN_EMAIL = 'admissions@skymirror.eu';

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
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Log the parsed data
    console.log('Application received:', data);
    
    // Send notification email to admin
    try {
      sendAdminNotification(data);
      console.log('Admin notification sent successfully');
    } catch (emailError) {
      console.log('Error sending admin notification:', emailError.toString());
    }
    
    // Send confirmation email to applicant
    try {
      sendConfirmationEmail(data);
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.log('Error sending confirmation email:', emailError.toString());
    }
    
    // Return success response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Application submitted successfully"
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
      
  } catch (error) {
    console.log('Error in doPost:', error.toString());
    
    // Return error response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Failed to process application"
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

/**
 * Sends notification email to admin about new application
 * @param {Object} data The parsed JSON data from the form.
 */
function sendAdminNotification(data) {
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: 'New Skymirror Academy Application',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">New Application Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Program:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.program || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Background:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.background || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Why Interested:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.whyInterested || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Vanguard Cohort:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.VanguardCohortInterest ? 'Yes' : 'No'}</td></tr>
        </table>
        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
          Submitted at: ${new Date().toLocaleString()}
        </p>
      </div>
    `
  });
}

/**
 * Sends a templated confirmation email to the applicant.
 * @param {Object} data The parsed JSON data from the form.
 */
function sendConfirmationEmail(data) {
  MailApp.sendEmail({
    to: data.email,
    subject: 'Skymirror Academy Application Received',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3b82f6; text-align: center;">Thank you for your application!</h1>
        <p style="color: #1f2937; line-height: 1.6;">Dear ${data.firstName},</p>
        <p style="color: #1f2937; line-height: 1.6;">We've received your application for Skymirror Academy's program. Here's what happens next:</p>
        <ol style="color: #1f2937; line-height: 1.6;">
          <li>Our team will review your application.</li>
          <li>We'll contact you within 7-10 business days.</li>
          <li>Next steps will be shared via email.</li>
        </ol>
        <p style="color: #1f2937; line-height: 1.6;">If you have any questions, please reply to this email or contact us at ${ADMIN_EMAIL}.</p>
        <p style="color: #1f2937; line-height: 1.6;">Best regards,<br>The Skymirror Academy Team</p>
        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
          Website: https://skymirror.eu<br>
          Contact: ${ADMIN_EMAIL}
        </p>
      </div>
    `
  });
}