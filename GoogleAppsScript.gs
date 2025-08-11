/**
 * Sends a templated confirmation email to the applicant.
 * This version includes a detailed message about the review process and next steps.
 * @param {Object} data The parsed JSON data from the form.
 */
function sendConfirmationEmail(data) {
  try {
    const subject = 'Application Received - Skymirror Academy';
    // --- UPDATED EMAIL CONTENT ---
    const htmlBody = `
      <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #7C3AED; color: #ffffff; padding: 20px;">
          <h1 style="margin: 0; font-size: 24px;">Thank You For Your Application!</h1>
        </div>
        <div style="padding: 20px 30px; line-height: 1.6; color: #333;">
          <p>Dear ${data.firstName || 'Applicant'},</p>
          <p>This email confirms that we have successfully received your application to Skymirror Academy. Thank you for taking the time to apply and for your interest in joining our community.</p>
          
          <h2 style="color: #7C3AED; font-size: 18px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">What Happens Next?</h2>
          <p>Our admissions team will now carefully review your submission. We evaluate every application individually and holistically.</p>
          <p>We are diligent in our review process and aim to get back to all applicants as soon as possible. <strong>You can typically expect to hear from us regarding the next steps within 7-10 business days.</strong></p>
          <p>Please be sure to monitor your inbox. We also recommend adding our email address, <strong>${ADMIN_EMAIL}</strong>, to your contacts to ensure our communications don't land in your spam folder.</p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #555;">Your Application Summary:</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              <li><strong>Name:</strong> ${data.firstName || ''} ${data.lastName || ''}</li>
              <li><strong>Program:</strong> ${data.program}</li>
              <li><strong>Vanguard Cohort Interest:</strong> ${data.VanguardCohortInterest ? 'Yes' : 'No'}</li>
            </ul>
          </div>
          
          <p style="margin-top: 25px;">We appreciate your patience during the review period and look forward to learning more about you.</p>
          <p>Best regards,<br><strong>The Skymirror Academy Admissions Team</strong></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px 30px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">${WEBSITE_URL}</p>
          <p style="margin: 5px 0 0 0;">Kálmán Imre utca 1, 1054 Budapest, Hungary</p>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: ADMIN_EMAIL
    });
    Logger.log(`Detailed confirmation email sent to ${data.email}.`);
  } catch (error) {
    Logger.log(`Error sending confirmation email: ${error.toString()}`);
    // We don't throw an error here because the main submission might have succeeded.
  }
}