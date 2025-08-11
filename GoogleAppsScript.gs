/**
 * Sends a templated confirmation email to the applicant.
 * This version includes a detailed message about the review process and next steps.
 * @param {Object} data The parsed JSON data from the form.
 */
function sendConfirmationEmail(data) {
  const email = data.email;
  const firstName = data.firstName;
  
  // Send single confirmation email to applicant
  MailApp.sendEmail({
    to: email,
    subject: 'Skymirror Academy Application Received',
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
        <p style="color: #1f2937; line-height: 1.6;">If you have any questions, feel free to reach out to us at contact@skymirror.eu.</p>
        <p style="color: #1f2937; line-height: 1.6;">Best regards,<br>The Skymirror Academy Team</p>
        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
          This email was sent from Skymirror Academy<br>
          Website: https://skymirror.eu<br>
          Contact: contact@skymirror.eu
        </p>
      </div>
    `
  });
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